import type { WSContext } from 'hono/ws';
import { RoomsRepository } from '../repositories';
import { RoomMemberTracker, RoomsTracker } from '../../domain';
import WebSocket from 'ws';
import type { auth } from '@/shared/clients/auth';

type RoomSession = typeof auth.$Infer.Session;

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
    const rooms = await RoomsRepository.getInstance().loadMany();

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
      console.warn(`WebSocket already connected for ${session.user.id} in room ${roomId}`);
      return;
    }

    this.wsClient.set(ws, { session, roomId });

    const member = room.join(
      RoomMemberTracker.create({
        memberId: session.user.id,
        host: session.user.id === room.ownerId,
        trackId: null,
      }),
    );

    const send = (data: any) => {
      ws.send(JSON.stringify(data));
    };
    const pipes = [
      room.events.buildListener('track_changed', send),
      room.events.buildListener('member_joined', send),
      room.events.buildListener('member_left', send),
    ];

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
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    const member = room.getMember(session.user.id);
    if (!member) {
      console.warn(`Member ${session.user.id} not found in room ${roomId}`);
      return;
    }

    member.leave();
    this.wsClient.delete(ws);
  }
}
