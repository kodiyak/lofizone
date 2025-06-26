import type { Api, RoomTrackerEventsData } from '@workspace/core';
import type { ComponentType } from 'react';
import type { z, ZodSchema } from 'zod';
import type { BasePlugin } from './base-plugin';

export interface PluginWidgetProps {
  room: Api.Room;
  plugin: Api.Plugin;
}

export interface InitializePluginProps<TState = any> {
  state: TState;
  api: PluginAPI;
}

export interface Plugin<TSchema extends ZodSchema<any>> {
  id: string;
  schema: TSchema;
  defaultValues: z.infer<TSchema>;
  controller: BasePlugin<z.infer<TSchema>>;
  components: {
    Widget: ComponentType<PluginWidgetProps>;
  };
}

type Unsubscribe = () => void;
type RoomTrackerEventPayload<TKey extends keyof RoomTrackerEventsData> =
  RoomTrackerEventsData[TKey] & {
    roomId: string;
    fromMe?: boolean;
  };
export interface PluginAPI {
  send<TKey extends keyof RoomTrackerEventsData>(
    event: TKey,
    data: RoomTrackerEventPayload<TKey>,
  ): void;
  on<TKey extends keyof RoomTrackerEventsData>(
    event: TKey,
    handler: (data: RoomTrackerEventPayload<TKey>) => void | Promise<void>,
  ): Unsubscribe;
  getCurrentRoom(): Api.Room;
  getCurrentMember(): Api.RoomMember;
  getCurrentPlugin(): Api.Plugin;
  getCurrentTrack(): Api.Track | null;
}
