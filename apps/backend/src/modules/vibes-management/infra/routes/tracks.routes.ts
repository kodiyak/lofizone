import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { s3Client } from '@/shared/clients/s3';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { generateAlbumId, generateId } from '@workspace/core';
import { env } from '@/env';
import { trackSchema } from '../../domain';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import type { Prisma } from '@workspace/db';

export function addTracksRoutes() {
  const app = new OpenAPIHono<{ Variables: { userId?: string } }>();

  // list tracks
  app.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'List of tracks',
          content: {
            'application/json': {
              schema: z.array(trackSchema),
            },
          },
        },
      },
      request: {
        query: z.object({
          playlistId: z.string().optional(),
        }),
      },
    }),
    async (c) => {
      const userId = c.get('userId');
      const playlistId = c.req.query('playlistId');
      const where: Prisma.TrackWhereInput = {
        uploadedById: userId || undefined,
        playlists: playlistId ? { some: { id: playlistId } } : undefined,
      };
      console.log(JSON.stringify(where, null, 2));
      const tracks = await db.track.findMany({ where });
      return c.json(parseArrayToSchema(tracks, trackSchema), 200);
    },
  );

  app.openapi(
    createRoute({
      method: 'post',
      path: '/',
      request: {
        body: {
          content: {
            'multipart/form-data': {
              schema: z.object({
                title: z.string().nonempty(),
                albumId: z.string().optional(),
                artistId: z.string().optional(),
                cover: z.instanceof(File).describe('Background file'),
                track: z.instanceof(File).describe('Audio file'),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Track created successfully',
          content: {
            'application/json': {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
        404: {
          description: 'No playlist found for uploaded tracks',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const trackId = generateId('track');
      const userId = c.get('userId');
      const { albumId, cover, track, title } = c.req.valid('form');
      const backgroundPath = `${env.s3.bucket}/${albumId}/${trackId}/background.${cover.name.split('.').pop()}`;
      const audioPath = `${env.s3.bucket}/${albumId}/${trackId}/audio.${track.name.split('.').pop()}`;

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const playlist = await db.playlist.findFirst({
        where: {
          ownerId: userId,
          type: 'my_uploaded',
        },
      });

      if (!playlist) {
        return c.json({ error: 'No playlist found for uploaded tracks' }, 404);
      }

      const coverUrl = await s3Client
        .putObject(backgroundPath, await fileToBuffer(cover), cover.type)
        .then((res) => res.url);
      await db.track.create({
        data: {
          id: trackId,
          title,
          playlists: { connect: { id: playlist.id } },
          uploadedBy: { connect: { id: c.get('userId') } },
          album: albumId
            ? { connect: { id: albumId } }
            : {
                create: {
                  id: generateAlbumId(),
                  title,
                  metadata: {
                    cover: coverUrl,
                  },
                },
              },
          duration: 190, // Placeholder duration, should be calculated from audio file
          metadata: {
            background: { type: cover.type, url: coverUrl },
            audio: await s3Client
              .putObject(audioPath, await fileToBuffer(track), track.type)
              .then((res) => res.url),
          },
        },
      });

      return c.json({ id: trackId }, 201);
    },
  );

  // show track
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:trackId',
      responses: {
        200: {
          description: 'Track details',
          content: {
            'application/json': {
              schema: trackSchema,
            },
          },
        },
        404: {
          description: 'Track not found',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const trackId = c.req.param('trackId');
      const track = await db.track.findUnique({
        where: { id: trackId },
      });
      if (!track) {
        return c.json({ error: 'Track not found' }, 404);
      }
      return c.json(trackSchema.parse(track), 200);
    },
  );

  return app;
}
