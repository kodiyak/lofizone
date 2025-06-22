import { z } from 'zod';

export const albumMetadataSchema = z.object({
  cover: z.string().nullish(),
});
export type AlbumMetadata = z.infer<typeof albumMetadataSchema>;

export const albumSchema = z.object({
  id: z.string(),
  title: z.string(),
  metadata: albumMetadataSchema,
});
export type AlbumSchema = z.infer<typeof albumSchema>;
