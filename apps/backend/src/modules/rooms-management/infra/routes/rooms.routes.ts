import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { RoomsService } from '../services';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { trackSchema } from '@/modules/vibes-management';
import { roomSchema } from '../../domain';
import { generateRoomId } from '@workspace/core';

export function getRoomsRoutes() {
  const app = new OpenAPIHono<{
    Variables: { userId: string };
  }>();

  /** [LIST] Rooms */
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

  /** [CREATE] Room */
  app.openapi(
    createRoute({
      method: 'post',
      path: '/',
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({ name: z.string().nonempty() }),
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Room created successfully',
          content: {
            'application/json': { schema: z.any() },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
      },
    }),
    async (c) => {
      const { name } = c.req.valid('json');
      const userId = c.get('userId');

      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const room = await db.room.create({
        data: {
          id: generateRoomId(),
          name,
          metadata: {},
          owner: { connect: { id: userId } },
        },
      });

      RoomsService.getInstance().tracker.addRoom({
        ownerId: userId,
        roomId: room.id,
        name: room.name,
      });

      return c.json(roomSchema.parse(room), 201);
    },
  );

  /** [SHOW] Room */
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId',
      responses: {
        200: {
          description: 'Room details',
          content: {
            'application/json': { schema: z.any() },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
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

  /** [PUT] */
  app.openapi(
    createRoute({
      method: 'put',
      path: '/:roomId',
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                name: z.string().optional(),
                playlistId: z.string().optional(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Room updated successfully',
          content: {
            'application/json': { schema: z.any() },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
      },
    }),
    async (c) => {
      const roomId = c.req.param('roomId');
      const { name, playlistId } = c.req.valid('json');
      if (!roomId) {
        return c.json({ error: 'Room ID is required' }, 400);
      }

      const service = RoomsService.getInstance();
      const room = service.tracker.getRoom(roomId);
      if (!room) {
        return c.json({ error: 'Room not found' }, 404);
      }

      if (playlistId !== undefined) room.updatePlaylist(playlistId);

      const updatedRoom = await db.room.update({
        where: { id: roomId },
        data: { name, playlistId },
      });

      return c.json(roomSchema.parse(updatedRoom), 200);
    },
  );

  /** [GET][MEMBERS] Room */
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId/members',
      responses: {
        200: {
          description: 'List of room members',
          content: {
            'application/json': { schema: z.array(z.any()) },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
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

  /** [GET][TRACKS] Room */
  app.openapi(
    createRoute({
      method: 'get',
      path: '/:roomId/tracks',
      responses: {
        200: {
          description: 'Room Tracks',
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

      if (!room.playlistId) {
        return c.json([], 200);
      }

      const playlist = await db.playlist.findUniqueOrThrow({
        where: { id: room.playlistId },
        include: {
          tracks: true,
        },
      });

      return c.json(parseArrayToSchema(playlist.tracks, trackSchema), 200);
    },
  );

  /** [POST][Tracks] Add Room Tracks */
  app.openapi(
    createRoute({
      method: 'post',
      path: '/:roomId/tracks',
      request: {
        body: {
          content: {
            'application/json': {
              schema: z.object({
                trackIds: z.array(z.string()).nonempty(),
              }),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Tracks added to room successfully',
          content: {
            'application/json': { schema: z.any() },
          },
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
        404: {
          description: 'Room not found',
          content: {
            'application/json': {
              schema: z.object({ error: z.string() }),
            },
          },
        },
      },
    }),
    async (c) => {
      /**
       * @todo Implement the logic to add tracks to a room.
       * This should include validating the room ID,
       * checking if the tracks exist,
       * and updating the room's playlist.
       * PS: remove playlist_changed event from the tracker
       * room will have your own playlist
       * and tracks will be added to the room's playlist.
       */
    },
  );

  return app;
}
