import type { RoomController } from './room.controller';
import type { Api } from '@workspace/core';
import { PluginRoomEntity } from './entities/plugin-room.entity';
import { definePluginAPI } from '@plugins/core';

export class PluginsController {
  private plugins: PluginRoomEntity[] = [];

  constructor(private readonly room: RoomController) {}

  public addPlugin(plugin: Api.Plugin) {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(
        `[PluginsController] Plugin ${plugin.name} is already added.`,
      );
      return;
    }
    const api = definePluginAPI({
      send: this.room.send.bind(this.room),
      on: this.room.on.bind(this.room),
      getCurrentRoom: () => this.room.room!,
      getCurrentMember: () =>
        this.room.members.find((m) => m.memberId === this.room.memberId)!,
      getCurrentTrack: () => this.room.track,
      getCurrentPlugin: () => plugin,
    });
    this.plugins.push(PluginRoomEntity.create(plugin, api));
  }

  public getPlugins() {
    return this.plugins;
  }

  public getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }
}
