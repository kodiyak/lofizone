import type { InitializePluginProps, PluginAPI } from './types.js';

export abstract class BasePlugin<TSettings = any, TState = any> {
  private settings: TSettings = {} as TSettings;
  private state: TState = {} as TState;

  protected api!: PluginAPI;

  protected get pluginId(): string {
    return this.api.getCurrentPlugin().id;
  }

  initialize(data: InitializePluginProps<TSettings, TState>) {
    this.state = data.state;
    this.settings = data.settings;
    this.api = data.api;

    const off = this.api.room.on('plugin_state_updated', (data) => {
      if (data.pluginId !== this.pluginId) return;
      this.state = data.state;
      this.onStateUpdate(data.state);
    });

    this.api.room.on('plugin_stopped', (data) => {
      if (data.pluginId !== this.pluginId) return;
      off();
    });

    this.onInit();
  }

  destroy() {
    this.onDestroy();
    this.api.room.send('plugin_stopped', {
      roomId: this.api.getCurrentRoom().roomId,
      pluginId: this.pluginId,
    });
  }

  setState(callback: (state: TState) => TState, emitToBackend = true) {
    this.state = callback(this.state);
    if (emitToBackend) {
      this.api.room.send('plugin_state_updated', {
        roomId: this.api.getCurrentRoom().roomId,
        pluginId: this.pluginId,
        state: this.state,
      });
    }
  }

  getState(): TState {
    return this.state;
  }

  setSettings(settings: TSettings) {
    this.settings = settings;
    this.api.room.send('plugin_settings_updated', {
      roomId: this.api.getCurrentRoom().roomId,
      pluginId: this.pluginId,
      settings,
    });
  }

  getSettings(): TSettings {
    return this.settings;
  }

  protected abstract onInit(): void;
  protected abstract onDestroy(): void;
  protected abstract onStateUpdate(state: TState): void;
}
