import { getAlbumsRoutes } from './albums.routes';
import { OpenAPIHono } from '@hono/zod-openapi';
import { addTracksRoutes } from './tracks.routes';
import { getArtistsRoutes } from './artists.routes';

export function getVibesManagementRoutes() {
  const app = new OpenAPIHono();
  app.route('/albums', getAlbumsRoutes());
  app.route('/tracks', addTracksRoutes());
  app.route('/artists', getArtistsRoutes());

  return app;
}
