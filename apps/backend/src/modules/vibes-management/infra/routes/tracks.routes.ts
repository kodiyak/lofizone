import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { s3Client } from '@/shared/clients/s3';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { generateId } from '@workspace/core';
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
                name: z.string().nonempty(),
                albumId: z.string().nonempty(),
                backgroundType: z.enum(['video', 'image']),
                backgroundFile: z.instanceof(File).describe('Background file'),
                audioFile: z.instanceof(File).describe('Audio file'),
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
      const { albumId, backgroundFile, backgroundType, audioFile, name } = c.req.valid('form');
      const backgroundPath = `${env.s3.bucket}/${albumId}/${trackId}/background.${backgroundFile.name.split('.').pop()}`;
      const audioPath = `${env.s3.bucket}/${albumId}/${trackId}/audio.${audioFile.name.split('.').pop()}`;
      await db.track.create({
        data: {
          id: trackId,
          album: { connect: { id: albumId } },
          duration: 190, // Placeholder duration, should be calculated from audio file
          title: name,
          metadata: {
            background: {
              type: backgroundType,
              url: await s3Client
                .putObject(backgroundPath, await fileToBuffer(backgroundFile), backgroundFile.type)
                .then((res) => res.url),
            },
            audio: await s3Client
              .putObject(audioPath, await fileToBuffer(audioFile), audioFile.type)
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
