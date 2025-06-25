import type { RoomTracker } from '@/modules/rooms-management';
import type { PluginApi } from './plugin-api';

export abstract class Plugin {
  abstract id: string;
  abstract ui: Plugin.UI;
  abstract bootstrap: () => Promise<void>;
  onRoomStarted?: (room: RoomTracker) => Promise<void>;
  onRoomStopped?: (room: RoomTracker) => Promise<void>;
  onMemberJoined?: (room: RoomTracker, memberId: string) => Promise<void>;
  onMemberLeft?: (room: RoomTracker, memberId: string) => Promise<void>;
  onClientEvent?: (roomId: string, memberId: string, event: string, data: any) => Promise<void>;

  constructor(protected readonly api: PluginApi) {}

  protected saveState(roomId: string, state: any) {
    return this.api.savePluginState(roomId, this.id, state);
  }

  protected getState(roomId: string) {
    return this.api.getPluginState(roomId, this.id);
  }

  protected broadcastToRoom(roomId: string, event: string, data: any) {
    return this.api.broadcastToRoom(roomId, this.id, event, data);
  }

  protected log(...args: any[]) {
    console.log(`[Plugin:${this.id}]`, ...args);
  }

  public toJSON(roomId?: string) {
    return {
      id: this.id,
      ui: this.ui,
      state: roomId ? this.getState(roomId) : undefined,
    };
  }
}

export namespace Plugin {
  export interface UI {
    gridWidth: number;
  }
}
