import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { TracksRepository } from '../repositories';
import { s3Client } from '@/shared/clients/s3';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { generateId } from '@workspace/core';
import { env } from '@/env';

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
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Album created successfully',
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
      const { albumId, backgroundFile, backgroundType, name } = c.req.valid('form');
      const path = `${env.s3.bucket}/${albumId}/${trackId}/background.${backgroundFile.name.split('.').pop()}`;
      s3Client.putObject(path, await fileToBuffer(backgroundFile), backgroundFile.type);
      await TracksRepository.getInstance().create({
        id: trackId,
        albumId,
        name,
        metadata: {
          background: {
            type: backgroundType,
            url: path,
          },
        },
      });

      return c.json({
        id: trackId,
      });
    },
  );

  return app;
}
