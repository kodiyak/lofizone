import { z } from 'zod';

export const roomMetadataSchema = z.object({
  cover: z.string().nullish(),
});
export type RoomMetadata = z.infer<typeof roomMetadataSchema>;

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  playlistId: z.string().nullish(),
  trackId: z.string().nullish(),
  metadata: roomMetadataSchema,
});
export type RoomSchema = z.infer<typeof roomSchema>;
