import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { db } from '@/shared/clients/db';
import { authMiddleware } from '../middlewares';
import type { auth } from '@/shared/clients/auth';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { playlistSchema } from '../../domain';

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

  return app;
}
