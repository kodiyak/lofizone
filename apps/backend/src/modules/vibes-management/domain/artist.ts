import { z } from 'zod';

export const artistMetadataSchema = z.object({
  image: z.string().nullish(),
  description: z.string().nullish(),
});
export type ArtistMetadata = z.infer<typeof artistMetadataSchema>;

export const artistSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  metadata: artistMetadataSchema,
});
export type ArtistSchema = z.infer<typeof artistSchema>;
