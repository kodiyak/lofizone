import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { evolution } from './routes/evolution';
import { env } from './env';
import { verses } from './routes/verses';

const app = new Hono();
app.route('/webhooks/evolution', evolution);
app.route('/api/verses', verses);

serve(app, ({ port }) => {
  console.log(`[http] Server is running on http://localhost:${port}`);
  console.log('[http] Press Ctrl+C to stop the server');
  console.log(env);
});
