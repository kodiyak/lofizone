import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { s3Client } from '@/shared/clients/s3';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { generateAlbumId, generateId } from '@workspace/core';
import { env } from '@/env';
import { trackSchema } from '../../domain';
import { db } from '@/shared/clients/db';

export function addTracksRoutes() {
  const app = new OpenAPIHono();

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
        200: {
          description: 'Track created successfully',
          content: {
            'application/json': {
              schema: z.object({
                id: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const trackId = generateId('track');
      const { albumId, cover, track, title } = c.req.valid('form');
      const backgroundPath = `${env.s3.bucket}/${albumId}/${trackId}/background.${cover.name.split('.').pop()}`;
      const audioPath = `${env.s3.bucket}/${albumId}/${trackId}/audio.${track.name.split('.').pop()}`;
      const coverUrl = await s3Client
        .putObject(backgroundPath, await fileToBuffer(cover), cover.type)
        .then((res) => res.url);
      await db.track.create({
        data: {
          id: trackId,
          title,
          // album: { connect: { id: albumId } },
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

      return c.json({
        id: trackId,
      });
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
