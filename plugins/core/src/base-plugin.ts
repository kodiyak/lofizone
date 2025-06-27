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

  setSettings(settings: TSettings) {
    this.settings = settings;
    this.api.send('plugin_settings_updated', {
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
