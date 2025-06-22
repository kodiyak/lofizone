import { z } from 'zod';

export const playlistMetadataSchema = z.object({
  cover: z.string().nullish(),
});
export type PlaylistMetadata = z.infer<typeof playlistMetadataSchema>;

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  ownerId: z.string(),
  metadata: playlistMetadataSchema,
});
export type PlaylistSchema = z.infer<typeof playlistSchema>;
