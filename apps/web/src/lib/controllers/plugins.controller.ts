import type { Plugin } from '@plugins/core';
import type { RoomController } from './room.controller';

export class PluginsController {
  private plugins = new Map<string, Plugin<any>>();

  constructor(private readonly room: RoomController) {}

  addPlugins(plugin: Plugin<any>[]) {
    for (const p of plugin) {
      this.addPlugin(p);
    }
    return this;
  }

  addPlugin(plugin: Plugin<any>) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with id ${plugin.id} already exists.`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  destroyPlugins(ids?: string[]) {
    if (!ids || ids.length === 0) {
      this.plugins.forEach((plugin) => plugin.controller.destroy());
      this.plugins.clear();
      return;
    }

    for (const id of ids) {
      const plugin = this.plugins.get(id);
      if (plugin) {
        plugin.controller.destroy();
        this.plugins.delete(id);
      } else {
        console.warn(`Plugin with id ${id} not found.`);
      }
    }
  }
}
