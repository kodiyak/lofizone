import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { AlbumsRepository } from '../repositories';
import { generateAlbumId } from '@workspace/core';
import { albumSchema } from '../../domain';
import { env } from '@/env';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { s3Client } from '@/shared/clients/s3';

export function getAlbumsRoutes() {
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
                artistId: z.string().nonempty(),
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
      const { artistId, name, cover } = c.req.valid('form');
      const albumId = generateAlbumId();
      const path = `${env.s3.bucket}/${albumId}/cover.${cover.name.split('.').pop()}`;
      const { ok: uploadSuccessfully } = await s3Client.putObject(
        path,
        await fileToBuffer(cover),
        cover.type,
      );
      const album = await AlbumsRepository.getInstance().create({
        id: albumId,
        artistId,
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
      const albums = await AlbumsRepository.getInstance().loadMany();
      return c.json(albums, 200);
    },
  );

  return app;
}
