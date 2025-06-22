import { OpenAPIHono } from '@hono/zod-openapi';
import { getPlaylistsRoutes } from './playlists.routes';

export function getAuthRoutes() {
  const app = new OpenAPIHono();
  app.route('/playlists', getPlaylistsRoutes());

  return app;
}
