import type { WSContext } from 'hono/ws';
import { RoomTracker } from '../../domain/tracker/room-tracker.js';
import { RoomsRepository } from '../repositories/index.js';
import { RoomsTracker } from '../../domain/index.js';
import WebSocket from 'ws';
import type { auth } from '@/shared/clients/auth';

type RoomSession = typeof auth.$Infer.Session.session;

export class RoomsService {
  private static instance: RoomsService;
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

  getRoomMembers(roomId: string) {
    return this.tracker.getRoom(roomId)?.getMembers() || [];
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
