import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { RoomsService } from '../services';
import { authMiddleware } from '@/modules/authentication';

export function getRoomsRoutes() {
  const app = new OpenAPIHono();
  app.use('*', authMiddleware);

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
      const service = RoomsService.getInstance();
      const rooms = service.getAllRooms();
      return c.json(rooms, 200);
    },
  );

  return app;
}
