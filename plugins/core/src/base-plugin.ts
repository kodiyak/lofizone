import type { InitializePluginProps, PluginAPI } from './types.js';
import type { Api } from '@workspace/core';

export abstract class BasePlugin<TSettings = any, TState = any> {
  private settings: TSettings = {} as TSettings;
  private state: TState = {} as TState;

  protected pluginId!: string;
  protected api!: PluginAPI;
  protected room!: Api.Room;
  protected plugin!: Api.Plugin;
  protected member!: Api.RoomMember;

  initialize(data: InitializePluginProps<TSettings, TState>) {
    this.state = data.state;
    this.settings = data.settings;
    this.api = data.api;
    this.onInit();
  }

  destroy() {
    this.onDestroy();
    this.api.send('plugin_stopped', {
      roomId: this.api.getCurrentRoom().roomId,
      pluginId: this.pluginId,
    });
  }

  setState(state: TState) {
    this.state = state;
    this.api.send('plugin_state_updated', {
      roomId: this.api.getCurrentRoom().roomId,
      pluginId: this.pluginId,
      state,
    });
  }

  getState(): TState {
    return this.state;
  }

  protected abstract onInit(): void;
  protected abstract onDestroy(): void;
  protected abstract onStateUpdate(state: TState): void;
}
