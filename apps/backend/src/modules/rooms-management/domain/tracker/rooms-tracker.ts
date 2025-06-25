import { RoomTracker, type RoomTrackerProps } from '../../domain/tracker/room-tracker';

export class RoomsTracker {
  private static instance: RoomsTracker;
  private rooms: RoomTracker[] = [];

  public static getInstance(): RoomsTracker {
    if (!RoomsTracker.instance) {
      RoomsTracker.instance = new RoomsTracker();
    }
    return RoomsTracker.instance;
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
