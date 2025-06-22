import { env } from './env';
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { getVibesManagementRoutes } from './modules/vibes-management';
import { getRoomsManagementRoutes, RoomsTracker } from './modules/rooms-management';

async function main() {
  await RoomsTracker.init(); // Initialize the RoomsTracker

  const app = new OpenAPIHono();
  app.route('/', getVibesManagementRoutes());
  app.route('/', getRoomsManagementRoutes());
  app.doc(`/doc`, {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
    },
  });

  serve(
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
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
