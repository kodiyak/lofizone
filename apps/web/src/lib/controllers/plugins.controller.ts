import type { RoomController } from './room.controller';
import type { Api } from '@workspace/core';
import { PluginRoomEntity } from './entities/plugin-room.entity';
import { definePluginAPI, usePluginsStore } from '@plugins/core';

export class PluginsController {
  private plugins: PluginRoomEntity[] = [];

  get store() {
    return {
      getState: usePluginsStore.getState,
      setState: usePluginsStore.setState,
    };
  }

  constructor(private readonly room: RoomController) {}

  public addPlugin(plugin: Api.Plugin) {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(
        `[PluginsController] Plugin ${plugin.name} is already added.`,
      );
      return;
    }
    const api = definePluginAPI({
      room: {
        send: this.room.send.bind(this.room),
        on: this.room.on.bind(this.room),
      },
      send: (event, data) => {
        this.room.send('plugin_event', {
          event,
          data: {
            memberId: this.room.memberId,
            roomId: this.room.room!.roomId,
            pluginId: plugin.id,
            name: plugin.name,
            data,
          },
        });
      },
      on: (event, callback) => {
        return this.room.on('plugin_event', (data) => {
          if (data.event !== event) return;
          if (data.data.pluginId !== plugin.id) return;
          callback(data.data);
        });
      },
      getCurrentRoom: () => this.room.room!,
      getCurrentMember: () =>
        this.room.members.find((m) => m.memberId === this.room.memberId)!,
      getCurrentTrack: () => this.room.track,
      getCurrentPlugin: () => plugin,
    });
    const entity = PluginRoomEntity.create(plugin, api);

    this.store.setState((state) => ({
      plugins: [
        ...state.plugins,
        {
          id: entity.id,
          name: entity.name,
          controller: entity.controller,
          settings: entity.controller.getSettings(),
          state: entity.controller.getState(),
        },
      ],
    }));

    this.plugins.push(entity);
  }

  public getPlugins() {
    return this.plugins;
  }

  public getPlugin(name: string) {
    return this.plugins.find((p) => p.name === name);
  }
}
