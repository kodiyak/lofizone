import { RoomsTracker, RoomTracker } from '@/modules/rooms-management';
import { PluginContext } from './plugin-context';

export class PluginApi {
  private static instance: PluginApi;

  private states = new Map<string, PluginContext>();

  private constructor(private readonly tracker: RoomsTracker = RoomsTracker.getInstance()) {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): PluginApi {
    if (!PluginApi.instance) {
      PluginApi.instance = new PluginApi();
    }
    return PluginApi.instance;
  }

  public getRoom(roomId: string) {
    return this.tracker.getRoom(roomId) || null;
  }

  public savePluginState(roomId: string, pluginId: string, state: any) {
    const stateKey = `${roomId}-${pluginId}`;
    if (this.states.has(stateKey)) {
      this.states.get(stateKey)?.setState(state);
    } else {
      const newState = PluginContext.create(pluginId, state);
      this.states.set(stateKey, newState);
    }
  }

  public getPluginState(roomId: string, pluginId: string): any | null {
    const stateKey = `${roomId}-${pluginId}`;
    return this.states.get(stateKey)?.getState() || null;
  }

  public broadcastToRoom(roomId: string, pluginId: string, event: string, data: any) {
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.warn(`Room with ID ${roomId} not found.`);
      return;
    }

    const members = room.getMembers();
    members.forEach((member) => {
      // @ts-expect-error: Dinnamic event emitter
      member.events.emit(event, { pluginId, ...data });
    });
  }
}
