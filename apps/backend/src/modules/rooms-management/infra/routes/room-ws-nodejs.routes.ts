import { Hono } from 'hono';
import { NodeWebSocket } from '@hono/node-ws';
import { RoomsService } from '../services';

export function getNodejsWsRoutes({ upgradeWebSocket }: NodeWebSocket) {
  const app = new Hono();
  const roomService = RoomsService.getInstance();

  app.get(
    '/:roomId/ws',
    upgradeWebSocket((c) => {
      const roomId = c.req.param('roomId');
      return {
        onOpen: (evt, ws) => {
          console.log(`WebSocket opened for room ${roomId}`);
          // roomService.handleJoin(ws, roomId);
        },
        onMessage: (evt, ws) => {
          const message = JSON.parse(evt.data.toString());
          // roomService.handleMessage(ws, roomId, message);
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
