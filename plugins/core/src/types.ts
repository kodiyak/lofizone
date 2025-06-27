import type { Api, RoomTrackerEventsData } from '@workspace/core';
import type { ComponentType } from 'react';
import type { z, ZodSchema } from 'zod';
import type { BasePlugin } from './base-plugin';

export interface PluginWidgetProps {
  room: Api.Room;
  plugin: Api.Plugin;
}

export interface PluginIconProps {
  className?: string;
}

export interface InitializePluginProps<TSettings = any, TState = any> {
  state: TState;
  settings: TSettings;
  api: PluginAPI;
}

export interface Plugin<
  TSettingsSchema extends ZodSchema<any>,
  TStateSchema extends ZodSchema<any>,
> {
  name: string;
  title: string;
  description: string;
  state: {
    schema: TStateSchema;
    defaultValues: z.infer<TStateSchema>;
  };
  settings: {
    schema: TSettingsSchema;
    defaultValues: z.infer<TSettingsSchema>;
  };
  buildController: () => BasePlugin<
    z.infer<TSettingsSchema>,
    z.infer<TStateSchema>
  >;
  components: {
    Icon: ComponentType<PluginIconProps>;
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
