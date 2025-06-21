import { getAlbumsRoutes } from './albums.routes';
import { OpenAPIHono } from '@hono/zod-openapi';

export function getVibesManagementRoutes() {
  const app = new OpenAPIHono();
  app.route('/albums', getAlbumsRoutes());

  return app;
}
