import { OpenAPIHono } from '@hono/zod-openapi';
import { getRoomsRoutes } from './rooms.routes';

export function getRoomsManagementRoutes() {
  const app = new OpenAPIHono();
  app.route('/rooms', getRoomsRoutes());

  return app;
}
