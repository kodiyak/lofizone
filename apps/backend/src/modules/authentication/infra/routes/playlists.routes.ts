import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@/shared/clients/db';
import { authMiddleware } from '../middlewares';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { playlistSchema } from '../../domain';
import { trackSchema } from '@/modules/vibes-management';

export function getPlaylistsRoutes() {
  const app = new OpenAPIHono<{ Variables: { userId: string } }>();
  app.use('*', authMiddleware);

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
    }),
    async (c) => {
      const userId = c.get('userId');

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      return c.json(
        parseArrayToSchema(
          await db.playlist.findMany({
            where: {
              ownerId: userId,
            },
          }),
          playlistSchema,
        ),
        200,
      );
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

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const playlist = await db.playlist.findFirst({
        where: {
          id: playlistId,
          ownerId: userId,
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
