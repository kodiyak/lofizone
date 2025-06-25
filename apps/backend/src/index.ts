import { env } from './env';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { createNodeWebSocket } from '@hono/node-ws';

import { getVibesManagementRoutes } from './modules/vibes-management';
import { getRoomsManagementRoutes, RoomsService } from './modules/rooms-management';
import { authMiddleware, getAuthRoutes } from './modules/authentication';
import { getPluginApi, PomodoroPlugin } from './modules/plugins';

async function main() {
  await RoomsService.init(); // Initialize the RoomsService
  await RoomsService.getInstance().addPlugin(new PomodoroPlugin(getPluginApi()));

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
  app.route('/', getAuthRoutes());
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
    ({ port }) => {
      console.log(`[http] Server is running on http://localhost:${port}`);
      console.log('[http] Press Ctrl+C to stop the server');
      console.log(env);
    },
  );

  ws.injectWebSocket(server);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
