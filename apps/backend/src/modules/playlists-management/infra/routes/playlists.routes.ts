import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { playlistSchema, playlistTypesSchema } from '../../domain';
import { trackSchema } from '@/modules/vibes-management';
import { generatePlaylistId } from '@workspace/core';
import type { Prisma } from '@workspace/db';

export function getPlaylistsRoutes() {
  const app = new OpenAPIHono<{ Variables: { userId: string } }>();

  app.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'List of playlists',
          content: {
            'application/json': {
              schema: z.array(z.any()),
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
      },
      request: {
        query: z.object({
          types: playlistTypesSchema.array().optional(),
        }),
      },
    }),
    async (c) => {
      const userId = c.get('userId');
      const { types } = c.req.valid('query');
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const where: Prisma.PlaylistWhereInput = {
        ownerId: userId,
      };

      if (types === undefined) {
        where.type = { notIn: ['room'] };
      } else {
        where.type = { in: types };
      }

      return c.json(parseArrayToSchema(await db.playlist.findMany({ where }), playlistSchema), 200);
    },
  );

  // show playlist
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:playlistId',
      responses: {
        200: {
          description: 'Playlist details',
          content: {
            'application/json': {
              schema: playlistSchema,
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
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
          description: 'Playlist not found',
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
      const { playlistId } = c.req.param();
      const userId = c.get('userId');

      if (!playlistId) {
        return c.json({ error: 'Playlist ID is required' }, 400);
      }

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const playlist = await db.playlist.findFirst({
        where: {
          id: playlistId,
          ownerId: userId,
        },
      });

      if (!playlist) {
        return c.json({ error: 'Playlist not found' }, 404);
      }

      return c.json(playlistSchema.parse(playlist), 200);
    },
  );

  // create playlist
  app.openapi(
    createRoute({
      method: 'post',
      path: '/',
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                name: z.string().min(1, 'Playlist name is required'),
                description: z.string().nullish(),
                isPublic: z.boolean().optional(),
              }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Playlist created successfully',
          content: {
            'application/json': {
              schema: playlistSchema,
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
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
      },
    }),
    async (c) => {
      const userId = c.get('userId');
      const { name, isPublic, description } = c.req.valid('json');

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const playlistId = generatePlaylistId();
      const playlist = await db.playlist.create({
        data: {
          id: playlistId,
          slug: playlistId,
          name,
          description,
          isPublic,
          metadata: { cover: null },
          owner: { connect: { id: userId } },
        },
      });

      return c.json(playlistSchema.parse(playlist), 201);
    },
  );

  //  playlist tracks
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:playlistId/tracks',
      responses: {
        200: {
          description: 'List of tracks in the playlist',
          content: {
            'application/json': {
              schema: z.array(z.any()),
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
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
          description: 'Playlist not found',
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
      const { playlistId } = c.req.param();
      const userId = c.get('userId');

      if (!playlistId) {
        return c.json({ error: 'Playlist ID is required' }, 400);
      }

      const playlist = await db.playlist.findFirst({
        where: {
          id: playlistId,
          ownerId: userId || undefined,
        },
        include: {
          tracks: true,
        },
      });

      if (!playlist) {
        return c.json({ error: 'Playlist not found' }, 404);
      }

      return c.json(parseArrayToSchema(playlist.tracks, trackSchema), 200);
    },
  );

  return app;
}
