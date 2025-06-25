import { Hono } from 'hono';
import { NodeWebSocket } from '@hono/node-ws';
import { RoomsService } from '../services';
import { auth } from '@/shared/clients/auth';
import { generateMemberId } from '@workspace/core';

export function getRoomsWsRoutes({ upgradeWebSocket }: NodeWebSocket) {
  const app = new Hono();

  app.get(
    '/:roomId/ws',
    upgradeWebSocket((c) => {
      const roomId = c.req.param('roomId');
      return {
        onOpen: async (evt, ws) => {
          const session = await auth.api.getSession({
            headers: c.req.raw.headers,
          });

          RoomsService.getInstance().handleJoin(
            ws,
            {
              memberId: generateMemberId(),
              userId: session?.user?.id || null,
            },
            roomId,
          );
        },
        onMessage: (evt, ws) => {
          RoomsService.getInstance().handleMessage(evt, ws);
        },
        onClose: (evt, ws) => {
          console.log(`WebSocket closed for room ${roomId}`);
          RoomsService.getInstance().handleLeave(ws);
        },
        onError: (evt, ws) => {
          console.error(`WebSocket error for room ${roomId}:`, evt);
        },
      };
    }),
  );

  return app;
}
