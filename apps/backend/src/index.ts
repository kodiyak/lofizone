import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './env';

const app = new Hono();
import('./modules/bots');

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
