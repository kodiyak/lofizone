import { Hono } from 'hono';
import { NodeWebSocket } from '@hono/node-ws';
import { RoomsService } from '../services';
import { auth } from '@/shared/clients/auth';

export function getRoomsWsRoutes({ upgradeWebSocket }: NodeWebSocket) {
  const app = new Hono();

  app.get(
    '/:roomId/ws',
    upgradeWebSocket((c) => {
      const roomId = c.req.param('roomId');
      console.log(`WebSocket connection request for room ${roomId}`);
      return {
        onOpen: async (evt, ws) => {
          const session = await auth.api.getSession({
            headers: c.req.raw.headers,
          });
          console.log(`WebSocket opened for room ${roomId}`, session);
          if (!session) {
            console.error(`No session found for room ${roomId}`);
            ws.close(1008, 'Unauthorized');
            return;
          }

          RoomsService.getInstance().handleJoin(ws, session.session, roomId);
        },
        onMessage: (evt, ws) => {
          const message = JSON.parse(evt.data.toString());
        },
        onClose: (evt, ws) => {
          console.log(`WebSocket closed for room ${roomId}`);
          // roomService.handleLeave(ws, roomId);
        },
        onError: (evt, ws) => {
          console.error(`WebSocket error for room ${roomId}:`, evt);
          // roomService.handleError(ws, roomId, evt);
        },
      };
    }),
  );

  return app;
}
