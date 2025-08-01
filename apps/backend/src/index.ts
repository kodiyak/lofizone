import { env } from './env';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { createNodeWebSocket } from '@hono/node-ws';

import { authMiddleware } from './modules/authentication';
import { getVibesManagementRoutes } from './modules/vibes-management';
import { getRoomsManagementRoutes, RoomsService } from './modules/rooms-management';
import { buildPluginsRegistry, getPluginsRoutes } from './modules/plugins';
import { getPlaylistsRoutes } from './modules/playlists-management';
import { createTimer } from './utils/timer';
import { getAuthRoutes } from './modules/authentication/infra/routes/auth.routes';

async function main() {
  const app = new OpenAPIHono();
  app.use(
    '*',
    cors({
      origin: 'http://localhost:4000',
      allowHeaders: ['Upgrade-Insecure-Requests', 'Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'PATCH', 'PUT', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    }),
  );

  const ws = createNodeWebSocket({ app });
  app.use('*', authMiddleware);
  app.route('/', getVibesManagementRoutes());
  app.route('/', getRoomsManagementRoutes(ws));
  app.route('/oauth', getAuthRoutes());
  app.route('/playlists', getPlaylistsRoutes());
  app.route('/', getPluginsRoutes());
  app.doc(`/doc`, {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
    },
  });

  const server = serve(
    {
      fetch: app.fetch,
      port: Number(env.port),
    },
    async ({ port }) => {
      console.log(`[http] Server is running on http://localhost:${port}`);
      console.log('[http] Press Ctrl+C to stop the server');
      console.log(env);
      await createTimer().exec('[PluginsRegistry]', buildPluginsRegistry);
      await createTimer().exec('[RoomsService]', () => RoomsService.init()); // Initialize the RoomsService
    },
  );

  ws.injectWebSocket(server);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
