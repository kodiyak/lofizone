import { PluginsRegistry } from '@plugins/core';
import type { Api } from '@workspace/core';

export class PluginRoomEntity {
  private constructor(private readonly plugin: Api.Plugin) {}

  get id() {
    return this.plugin.id;
  }

  get name() {
    return this.plugin.name;
  }

  get registry() {
    return PluginsRegistry.getInstance().getPlugin(this.plugin.name);
  }

  static create(plugin: Api.Plugin) {
    return new PluginRoomEntity(plugin);
  }
}
