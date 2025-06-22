import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@/shared/clients/db';
import { authMiddleware } from '../middlewares';
import type { auth } from '@/shared/clients/auth';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { playlistSchema } from '../../domain';
import { trackSchema } from '@/modules/vibes-management';

export function getPlaylistsRoutes() {
  const app = new OpenAPIHono<{ Variables: { session: typeof auth.$Infer.Session } }>();
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
      },
    }),
    async (c) => {
      return c.json(
        parseArrayToSchema(
          await db.playlist.findMany({
            where: {
              ownerId: c.get('session').user.id,
            },
          }),
          playlistSchema,
        ),
        200,
      );
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
      const session = c.get('session');

      const playlist = await db.playlist.findFirst({
        where: {
          id: playlistId,
          ownerId: session.user.id,
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
