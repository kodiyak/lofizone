import type { Plugin } from '@plugins/core';
import type { Api } from '@workspace/core';

export interface RoomScreenProps {
  room: Api.Room;
  page?: string;
}

export interface RoomInstallPluginProps {
  plugin: Plugin<any, any>;
  roomId: string;
}
