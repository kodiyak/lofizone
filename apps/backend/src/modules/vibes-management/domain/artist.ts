import { z } from 'zod';

export const artistMetadataSchema = z.object({
  image: z.string().optional(),
  description: z.string().optional(),
});
export type ArtistMetadata = z.infer<typeof artistMetadataSchema>;

export const artistSchema = z.object({
  id: z.string(),
  name: z.string().nonempty(),
  metadata: artistMetadataSchema,
});
export type ArtistSchema = z.infer<typeof artistSchema>;
