import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { RoomsTracker } from '../tracker';

export function getRoomsRoutes() {
  const app = new OpenAPIHono();

  app.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'List of rooms',
          content: {
            'application/json': {
              schema: z.array(z.any()),
            },
          },
        },
      },
    }),
    async (c) => {
      const tracker = RoomsTracker.getInstance();
      const rooms = tracker.getAllRooms();
      return c.json(rooms, 200);
    },
  );

  return app;
}
