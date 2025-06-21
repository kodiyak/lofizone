import { OpenAPIHono, z } from '@hono/zod-openapi';
import { defineRoute } from '@/shared/infra/define-route';
import { AlbumsRepository } from '../repositories';
import { generateId } from '@workspace/core';
import { albumSchema } from '../../domain';

export function getAlbumsRoutes() {
  const app = new OpenAPIHono();

  defineRoute({
    method: 'post',
    path: '/',
    app,
    schemas: {
      scope: 'form',
      input: z.object({
        name: z.string().nonempty(),
        artist: z.string().nonempty(),
      }),
      output: z.object({
        id: z.string(),
      }),
    },
    handler: async (payload) => {
      const album = await AlbumsRepository.getInstance().create({
        id: generateId('alb'),
        artist: payload.artist,
        name: payload.name,
        metadata: {
          cover: '',
        },
      });

      return {
        id: album.id,
      };
    },
  });

  defineRoute({
    method: 'get',
    path: '/',
    app,
    schemas: {
      scope: 'json',
      input: z.object({}).optional(),
      output: z.object({
        data: albumSchema.array(),
      }),
    },
    handler: async () => {
      const albums = await AlbumsRepository.getInstance().findAll();
      return {
        data: albums,
      };
    },
  });

  return app;
}
