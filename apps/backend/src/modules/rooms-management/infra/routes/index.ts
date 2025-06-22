import { OpenAPIHono } from '@hono/zod-openapi';
import { getRoomsRoutes } from './rooms.routes';
import type { NodeWebSocket } from '@hono/node-ws';

export function getRoomsManagementRoutes(socket: NodeWebSocket) {
  const app = new OpenAPIHono();
  app.route('/rooms', getRoomsRoutes(socket));

  return app;
}
