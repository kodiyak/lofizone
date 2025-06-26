import { PluginsRegistry } from '@plugins/core';
import type { RoomTracker } from './room-tracker';

interface RoomPlugin {
  id: string;
  name: string;
  settings: any;
  installedAt: Date;
}

export class RoomPlugins {
  private plugins: RoomPlugin[] = [];

  constructor(private readonly room: RoomTracker) {}

  public addPlugin(plugin: RoomPlugin) {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered in the room.`);
      return;
    }

    this.plugins.push(plugin);
  }

  public removePlugin(pluginName: string) {
    const index = this.plugins.findIndex((p) => p.name === pluginName);
    if (index === -1) {
      console.warn(`Plugin ${pluginName} is not registered in the room.`);
      return;
    }

    this.plugins.splice(index, 1);
  }

  public getPlugin(pluginName: string) {
    return this.plugins.find((p) => p.name === pluginName);
  }

  public getPluginRegistry(pluginName: string) {
    return PluginsRegistry.getInstance().getPlugin(pluginName);
  }

  public reset() {
    this.plugins = [];
  }

  public getPlugins() {
    return this.plugins;
  }

  toJSON() {
    return this.plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      installedAt: plugin.installedAt.getTime(),
      settings: plugin.settings,
    }));
  }
}
