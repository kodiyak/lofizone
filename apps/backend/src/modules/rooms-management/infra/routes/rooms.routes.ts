import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { RoomsService } from '../services';
import { authMiddleware } from '@/modules/authentication';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { trackSchema } from '@/modules/vibes-management';

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

  // show room
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId',
      responses: {
        200: {
          description: 'Room details',
          content: {
            'application/json': {
              schema: z.any(),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const roomId = c.req.param('roomId');
      if (!roomId) {
        return c.json({ error: 'Room ID is required' }, 400);
      }

      const service = RoomsService.getInstance();
      const room = service.tracker.getRoom(roomId);
      if (!room) {
        return c.json({ error: 'Room not found' }, 404);
      }

      return c.json(room.toJSON(), 200);
    },
  );

  // room members
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId/members',
      responses: {
        200: {
          description: 'List of room members',
          content: {
            'application/json': {
              schema: z.array(z.any()),
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const roomId = c.req.param('roomId');
      if (!roomId) {
        return c.json({ error: 'Room ID is required' }, 400);
      }

      const service = RoomsService.getInstance();
      const members = service.getRoomMembers(roomId);
      if (!members) {
        return c.json({ error: 'Room not found' }, 404);
      }

      return c.json(members, 200);
    },
  );

  // room playlist
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId/playlist',
      responses: {
        200: {
          description: 'Room playlist',
          content: {
            'application/json': {
              schema: z.array(z.any()),
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({
                error: z.string(),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const roomId = c.req.param('roomId');
      if (!roomId) {
        return c.json({ error: 'Room ID is required' }, 400);
      }

      const service = RoomsService.getInstance();
      const room = service.tracker.getRoom(roomId);
      if (!room) {
        return c.json({ error: 'Room not found' }, 404);
      }

      const playlist = await db.playlist.findFirstOrThrow({
        where: { ownerId: room.ownerId },
        include: {
          tracks: true,
        },
      });

      return c.json(parseArrayToSchema(playlist.tracks, trackSchema), 200);
    },
  );

  return app;
}
