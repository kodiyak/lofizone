import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { RoomsService } from '../services';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';
import { trackSchema } from '@/modules/vibes-management';
import { roomSchema } from '../../domain';
import { generatePlaylistId, generateRoomId } from '@workspace/core';
import kebabCase from 'lodash.kebabcase';

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

      const roomId = generateRoomId();
      const playlistId = generatePlaylistId();
      const room = await db.room.create({
        data: {
          id: roomId,
          name,
          metadata: {},
          owner: { connect: { id: userId } },
          playlist: {
            create: {
              id: playlistId,
              type: 'room',
              name: `${name}'s Playlist`,
              slug: `${kebabCase(name)}-${roomId}`,
              owner: { connect: { id: userId } },
              metadata: { cover: null },
            },
          },
        },
      });

      RoomsService.getInstance().tracker.addRoom({
        playlistId,
        roomId,
        ownerId: userId,
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
      const room = service.getRoom(roomId);
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
      const { name } = c.req.valid('json');
      if (!roomId) {
        return c.json({ error: 'Room ID is required' }, 400);
      }

      const service = RoomsService.getInstance();
      const room = service.getRoom(roomId);
      if (!room) {
        return c.json({ error: 'Room not found' }, 404);
      }

      const updatedRoom = await db.room.update({
        where: { id: roomId },
        data: { name },
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
      const members = service.getRoom(roomId)?.getMembers();
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
      const room = service.getRoom(roomId);
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
                tracksIds: z.array(z.string()).nonempty(),
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
      const roomId = c.req.param('roomId');
      const { tracksIds } = c.req.valid('json');
      const { playlistId } = await db.room.update({
        where: { id: roomId },
        data: {
          playlist: { update: { tracks: { connect: tracksIds.map((id) => ({ id })) } } },
        },
        select: { id: true, playlistId: true },
      });

      RoomsService.getInstance().getRoom(roomId)?.addTracks(tracksIds);

      return c.json(
        {
          roomId,
          playlistId,
        },
        200,
      );
    },
  );

  return app;
}
