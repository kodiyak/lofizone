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
  member_joined: z
    .object({
      memberId: z.string(),
      host: z.boolean(),
    })
    .passthrough(),
  member_left: z
    .object({
      memberId: z.string(),
    })
    .passthrough(),
  player_paused: z
    .object({
      memberId: z.string(),
    })
    .passthrough(),
  player_resumed: z
    .object({
      memberId: z.string(),
    })
    .passthrough(),
  player_seeked: z
    .object({
      memberId: z.string(),
      time: z.number(),
    })
    .passthrough(),
  track_changed: z
    .object({
      memberId: z.string(),
      trackId: z.string().nullable(),
    })
    .passthrough(),
  track_added: z
    .object({
      memberId: z.string(),
      trackId: z.string(),
    })
    .passthrough(),
  track_removed: z
    .object({
      memberId: z.string(),
      trackId: z.string(),
    })
    .passthrough(),
  plugin_installed: RoomPluginEvents.shape.plugin_installed
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_uninstalled: RoomPluginEvents.shape.plugin_uninstalled
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_started: RoomPluginEvents.shape.plugin_started
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_stopped: RoomPluginEvents.shape.plugin_stopped
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_state_updated: RoomPluginEvents.shape.plugin_state_updated
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_settings_updated: RoomPluginEvents.shape.plugin_settings_updated
    .extend({
      pluginId: z.string(),
    })
    .passthrough(),
  plugin_event: z
    .object({
      event: z.string(),
      data: z.object({
        memberId: z.string(),
        roomId: z.string(),
        pluginId: z.string(),
        name: z.string(),
        data: z.any(),
      }),
    })
    .passthrough(),
});
export type RoomTrackerEventsData = z.infer<typeof RoomTrackerEvents>;
