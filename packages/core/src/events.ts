import { z } from 'zod';

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
  plugin_started: z.object({
    pluginId: z.string(),
    roomId: z.string(),
  }),
  plugin_stopped: z.object({
    pluginId: z.string(),
    roomId: z.string(),
  }),
});
export type RoomTrackerEventsData = z.infer<typeof RoomTrackerEvents>;

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
