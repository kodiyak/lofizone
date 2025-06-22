import type { WSContext } from 'hono/ws';
import { RoomTracker, type RoomTrackerProps } from '../../domain/tracker/room-tracker';
import { RoomsRepository } from '../repositories';

export class RoomsService {
  private static instance: RoomsService;
  private rooms = new Map<string, RoomTracker>();
  private wsClient = new Map<WSContext<WebSocket>, { memberId: string; roomId: string }>();

  public static getInstance(): RoomsService {
    if (!RoomsService.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance;
  }

  static async init(): Promise<void> {
    // const tracker = this.getInstance();
    const rooms = await RoomsRepository.getInstance().loadMany();

    // rooms.forEach((room) => {
    //   tracker.addRoom({
    //     roomId: room.id,
    //     name: room.name || undefined,
    //     playlistId: room.playlistId || null,
    //     cover: room.metadata?.cover,
    //   });
    // });
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  handleJoin(ws: WSContext<WebSocket>, roomId: string, memberId: string) {
    const room = this.rooms.get(roomId);

    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }
  }
}
