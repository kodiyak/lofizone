import { serve } from '@hono/node-server';
import { env } from './env';
import { getVibesManagementRoutes } from './modules/vibes-management';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();
app.route('/', getVibesManagementRoutes());
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
