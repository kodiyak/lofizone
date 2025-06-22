import { OpenAPIHono } from '@hono/zod-openapi';
import { getRoomsRoutes } from './rooms.routes';
import type { NodeWebSocket } from '@hono/node-ws';
import { getRoomsWsRoutes } from './rooms-ws.routes';

export function getRoomsManagementRoutes(socket: NodeWebSocket) {
  const app = new OpenAPIHono();
  app.route('/rooms', getRoomsRoutes());
  app.route('/rooms', getRoomsWsRoutes(socket));

  return app;
}
