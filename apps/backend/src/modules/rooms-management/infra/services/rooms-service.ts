import type { WSContext } from 'hono/ws';
import { RoomTracker } from '../../domain/tracker/room-tracker';
import { RoomsRepository } from '../repositories';
import { RoomsTracker } from '../../domain';
import WebSocket from 'ws';
import type { auth } from '@/shared/clients/auth';

type RoomSession = typeof auth.$Infer.Session.session;

export class RoomsService {
  private static instance: RoomsService;
  private rooms = new Map<string, RoomTracker>();
  private wsClient = new Map<WSContext<WebSocket>, { memberId: string; roomId: string }>();

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
        name: room.name || undefined,
        playlistId: room.playlistId || null,
        cover: room.metadata?.cover,
      });
    });
  }

  getAllRooms() {
    return this.tracker.getAllRooms();
  }

  handleJoin(ws: WSContext<WebSocket>, session: RoomSession, roomId: string) {
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    console.log({
      roomId,
      ws,
      session,
    });
  }
}
