import { PluginsRegistry } from '@plugins/core';
import type { RoomTracker } from './room-tracker';
import { RoomPlugin, RoomPluginProps } from './room-plugin';

export class RoomPlugins {
  private plugins: RoomPlugin[] = [];

  constructor(private readonly room: RoomTracker) {}

  public addPlugin(pluginProps: Omit<RoomPluginProps, 'roomId'>) {
    if (this.plugins.some((p) => p.name === pluginProps.name)) {
      console.warn(`Plugin ${pluginProps.name} is already registered in the room.`);
      return;
    }

    const plugin = RoomPlugin.create({
      ...pluginProps,
      roomId: this.room.roomId,
    });
    this.plugins.push(plugin);

    const tunnelEvents = [
      plugin.events.buildListener('plugin_installed', ({ roomId }) => {
        this.room.events.emit('plugin_installed', {
          pluginId: plugin.id,
          roomId,
        });
      }),
      plugin.events.buildListener('plugin_uninstalled', ({ roomId }) => {
        this.room.events.emit('plugin_uninstalled', {
          pluginId: plugin.id,
          roomId,
        });
      }),
      plugin.events.buildListener('plugin_started', ({ roomId }) => {
        this.room.events.emit('plugin_started', {
          pluginId: plugin.id,
          roomId,
        });
      }),
      plugin.events.buildListener('plugin_stopped', ({ roomId }) => {
        this.room.events.emit('plugin_stopped', {
          pluginId: plugin.id,
          roomId,
        });
      }),
      plugin.events.buildListener('plugin_state_updated', ({ roomId, state }) => {
        this.room.events.emit('plugin_state_updated', {
          pluginId: plugin.id,
          roomId,
          state,
        });
      }),
      plugin.events.buildListener('plugin_settings_updated', ({ roomId, settings }) => {
        this.room.events.emit('plugin_settings_updated', {
          pluginId: plugin.id,
          roomId,
          state: settings,
        });
      }),
    ];

    this.room.events.buildListener('plugin_stopped', ({ off }) => {
      tunnelEvents.forEach(({ off }) => off());
      off();
    });

    return plugin;
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
