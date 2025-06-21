import { z } from 'zod';

export const albumMetadataSchema = z.object({
  cover: z.string(),
});
export type AlbumMetadata = z.infer<typeof albumMetadataSchema>;

export const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string(),
  metadata: albumMetadataSchema,
});
export type AlbumSchema = z.infer<typeof albumSchema>;
