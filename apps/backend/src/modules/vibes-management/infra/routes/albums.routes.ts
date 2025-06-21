import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AlbumsRepository } from '../repositories';
import { generateId } from '@workspace/core';
import { albumSchema } from '../../domain';
import { s3mini } from 's3mini';
import { env } from '@/env';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';

export function getAlbumsRoutes() {
  const app = new OpenAPIHono();
  const s3client = new s3mini(env.s3);

  app.openapi(
    createRoute({
      method: 'post',
      path: '/',
      request: {
        body: {
          content: {
            'multipart/form-data': {
              schema: z.object({
                artist: z.string().nonempty(),
                name: z.string().nonempty(),
                cover: z.instanceof(File).describe('Cover image file'),
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
      const { artist, name, cover } = c.req.valid('form');
      const albumId = generateId('alb');
      const path = `${env.s3.bucket}/${albumId}/cover.${cover.name.split('.').pop()}`;
      const { ok: uploadSuccessfully } = await s3client.putObject(
        path,
        await fileToBuffer(cover),
        cover.type,
      );
      const album = await AlbumsRepository.getInstance().create({
        id: albumId,
        artist,
        name,
        metadata: { cover: uploadSuccessfully ? path : null },
      });

      return c.json({ id: album.id }, 200);
    },
  );

  app.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'List of albums',
          content: {
            'application/json': {
              schema: z.array(albumSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const albums = await AlbumsRepository.getInstance().findAll();
      return c.json(albums, 200);
    },
  );

  return app;
}
