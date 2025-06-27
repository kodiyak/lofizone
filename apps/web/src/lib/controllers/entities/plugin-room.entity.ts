import { PluginsRegistry, type PluginAPI } from '@plugins/core';
import type { Api } from '@workspace/core';
import { BasePlugin } from '@plugins/core';

export class PluginRoomEntity {
  get id() {
    return this.plugin.id;
  }

  get name() {
    return this.plugin.name;
  }

  get registry() {
    const registry = PluginsRegistry.getInstance().getPlugin(this.plugin.name);
    if (!registry) {
      throw new Error(`Plugin ${this.plugin.name} is not registered.`);
    }

    return registry;
  }

  private readonly _controller: BasePlugin;

  get controller() {
    return this._controller;
  }

  private constructor(
    private readonly plugin: Api.Plugin,
    api: PluginAPI,
  ) {
    this._controller = this.registry.buildController();
    this._controller.initialize({
      api,
      state: this.plugin.lastState,
      settings: this.plugin.settings,
    });
  }

  static create(plugin: Api.Plugin, api: PluginAPI) {
    return new PluginRoomEntity(plugin, api);
  }
}
