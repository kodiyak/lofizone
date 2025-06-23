import type { WSContext } from 'hono/ws';
import { RoomMemberTracker, roomSchema, RoomsTracker } from '../../domain';
import WebSocket from 'ws';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';

interface RoomSession {
  memberId: string;
  userId: string | null;
}

export class RoomsService {
  private static instance: RoomsService;
  private wsClient = new Map<WSContext<WebSocket>, { session: RoomSession; roomId: string }>();

  private static get tracker() {
    return RoomsTracker.getInstance();
  }

  get tracker() {
    return RoomsService.tracker;
  }

  public static getInstance(): RoomsService {
    if (!RoomsService.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance;
  }

  static async init(): Promise<void> {
    const rooms = parseArrayToSchema(await db.room.findMany({}), roomSchema);

    rooms.forEach((room) => {
      this.tracker.addRoom({
        roomId: room.id,
        ownerId: room.ownerId,
        name: room.name || undefined,
        playlistId: room.playlistId || null,
        cover: room.metadata?.cover,
      });
    });
  }

  getAllRooms() {
    return this.tracker.getAllRooms();
  }

  getRoomMembers(roomId: string) {
    return this.tracker.getRoom(roomId)?.getMembers() || [];
  }

  handleJoin(ws: WSContext<WebSocket>, session: RoomSession, roomId: string) {
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    if (this.wsClient.has(ws)) {
      console.warn(`WebSocket already connected for ${session.userId || 'N/A'} in room ${roomId}`);
      return;
    }

    this.wsClient.set(ws, { session, roomId });

    const send = (event: string) => {
      return (data: any) => {
        ws.send(JSON.stringify({ event, data }));
      };
    };
    const pipes = [
      room.events.buildListener('track_changed', send('track_changed')),
      room.events.buildListener('member_joined', send('member_joined')),
      room.events.buildListener('member_left', send('member_left')),
    ];

    const member = room.join(
      RoomMemberTracker.create({
        memberId: session.memberId,
        userId: session.userId,
        host: session.userId === room.ownerId,
        trackId: null,
      }),
    );
    member.events.buildListener('member_left', ({ off: offMemberLeft }) => {
      const client = this.wsClient.get(ws);
      if (!client) {
        console.warn('WebSocket client not found');
        return;
      }

      pipes.forEach((pipe) => pipe.off());
      offMemberLeft();
    });
  }

  handleLeave(ws: WSContext<WebSocket>) {
    const client = this.wsClient.get(ws);
    if (!client) {
      console.warn('WebSocket client not found');
      return;
    }

    const { session, roomId } = client;
    const { memberId } = session;
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    const member = room.getMember(memberId);
    if (!member) {
      console.warn(`Member ${session.userId} not found in room ${roomId}`);
      return;
    }

    member.leave();
    this.wsClient.delete(ws);
  }
}
