import { RoomTracker, type RoomTrackerProps } from '../../domain/tracker/room-tracker';
import { RoomsRepository } from '../repositories';

export class RoomsTracker {
  private static instance: RoomsTracker;
  private rooms: RoomTracker[] = [];

  public static getInstance(): RoomsTracker {
    if (!RoomsTracker.instance) {
      RoomsTracker.instance = new RoomsTracker();
    }
    return RoomsTracker.instance;
  }

  static async init(): Promise<void> {
    const tracker = this.getInstance();
    const rooms = await RoomsRepository.getInstance().loadMany();

    rooms.forEach((room) => {
      tracker.addRoom({
        roomId: room.id,
        name: room.name || undefined,
        playlistId: room.playlistId || null,
        cover: room.metadata?.cover,
      });
    });
  }

  public addRoom(props: RoomTrackerProps): RoomTracker {
    const roomTracker = new RoomTracker(props);
    this.rooms.push(roomTracker);

    return roomTracker;
  }

  public getRoom(roomId: string): RoomTracker | undefined {
    return this.rooms.find((room) => room.roomId === roomId);
  }

  public removeRoom(roomId: string): void {
    this.rooms = this.rooms.filter((room) => room.roomId !== roomId);
  }

  public getAllRooms(): RoomTracker[] {
    return this.rooms;
  }
}
