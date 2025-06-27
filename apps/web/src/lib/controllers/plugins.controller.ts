import type { RoomController } from './room.controller';
import type { Api } from '@workspace/core';
import { PluginRoomEntity } from './entities/plugin-room.entity';

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
    this.plugins.push(PluginRoomEntity.create(plugin));
  }

  public getPlugins() {
    return this.plugins;
  }

  public getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }
}
