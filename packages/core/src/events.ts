import { z } from 'zod';

export const RoomMemberTrackerEvents = z.object({
  track_changed: z.object({
    trackId: z.string().nullable(),
  }),
  playlist_changed: z.object({
    playlistId: z.string().nullable(),
  }),
  member_left: z.object({}),
});
export type RoomMemberTrackerEventsData = z.infer<
  typeof RoomMemberTrackerEvents
>;

export const RoomPluginEvents = z.object({
  plugin_installed: z.object({
    roomId: z.string(),
  }),
  plugin_uninstalled: z.object({
    roomId: z.string(),
  }),
  plugin_started: z.object({
    roomId: z.string(),
    name: z.string(),
    settings: z.any(),
    state: z.any(),
  }),
  plugin_stopped: z.object({
    roomId: z.string(),
  }),
  plugin_settings_updated: z.object({
    roomId: z.string(),
    settings: z.any(),
  }),
  plugin_state_updated: z.object({
    roomId: z.string(),
    state: z.any(),
  }),
});
export type RoomPluginEventsData = z.infer<typeof RoomPluginEvents>;

export const RoomTrackerEvents = z.object({
  member_joined: z.object({
    memberId: z.string(),
    host: z.boolean(),
  }),
  member_left: z.object({
    memberId: z.string(),
  }),
  player_paused: z.object({
    memberId: z.string(),
  }),
  player_resumed: z.object({
    memberId: z.string(),
  }),
  player_seeked: z.object({
    memberId: z.string(),
    time: z.number(),
  }),
  track_changed: z.object({
    memberId: z.string(),
    trackId: z.string().nullable(),
  }),
  track_added: z.object({
    memberId: z.string(),
    trackId: z.string(),
  }),
  track_removed: z.object({
    memberId: z.string(),
    trackId: z.string(),
  }),
  plugin_installed: z.object({
    pluginId: z.string(),
    roomId: z.string(),
  }),
  plugin_uninstalled: z.object({
    pluginId: z.string(),
    roomId: z.string(),
  }),
  // plugin_started: z.object({
  //   pluginId: z.string(),
  //   roomId: z.string(),
  //   name: z.string(),
  //   settings: z.any().optional(),
  //   state: z.any().optional(),
  // }),
  plugin_started: RoomPluginEvents.shape.plugin_started.extend({
    pluginId: z.string(),
  }),
  plugin_stopped: z.object({
    pluginId: z.string(),
    roomId: z.string(),
  }),
  plugin_state_updated: z.object({
    pluginId: z.string(),
    roomId: z.string(),
    state: z.any(),
  }),
  plugin_settings_updated: z.object({
    pluginId: z.string(),
    roomId: z.string(),
    state: z.any(),
  }),
});
export type RoomTrackerEventsData = z.infer<typeof RoomTrackerEvents>;
