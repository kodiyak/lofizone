import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { ArtistsRepository } from '../repositories';
import { generateArtistId } from '@workspace/core';
import { albumSchema } from '../../domain';
import { env } from '@/env';
import { fileToBuffer } from '@/shared/infra/file-to-buffer';
import { s3Client } from '@/shared/clients/s3';

export function getArtistsRoutes() {
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
                about: z.string().nullish(),
                avatar: z.instanceof(File).describe('Artist avatar file'),
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
      const { name, avatar, about } = c.req.valid('form');
      const artistId = generateArtistId();
      const path = `${env.s3.bucket}/${artistId}/cover.${avatar.name.split('.').pop()}`;
      const { ok: uploadSuccessfully } = await s3Client.putObject(
        path,
        await fileToBuffer(avatar),
        avatar.type,
      );
      const album = await ArtistsRepository.getInstance().create({
        id: artistId,
        name,
        metadata: { image: uploadSuccessfully ? path : null, description: about },
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
              schema: albumSchema.array(),
            },
          },
        },
      },
    }),
    async (c) => {
      const albums = await ArtistsRepository.getInstance().loadMany();
      return c.json(albums, 200);
    },
  );

  return app;
}
