import { z } from 'zod';

export const trackMetadataSchema = z.object({
  background: z
    .object({
      type: z.enum(['video', 'image']),
      url: z.string(),
    })
    .nullish(),
  audio: z.string(),
});
export type TrackMetadata = z.infer<typeof trackMetadataSchema>;

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  albumId: z.string(),
  metadata: trackMetadataSchema,
});
export type TrackSchema = z.infer<typeof trackSchema>;
