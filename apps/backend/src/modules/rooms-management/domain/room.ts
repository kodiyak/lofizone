import { z } from 'zod';

const backgroundSchema = z.object({
  src: z.string(),
  className: z.string().nullish(),
  imgClassName: z.string().nullish(),
  gradients: z
    .array(
      z.object({
        className: z.string(),
      }),
    )
    .nullish(),
});

export const roomMetadataSchema = z.object({
  cover: z.string().nullish(),
  theme: z
    .object({
      backgroundState: z.enum(['hidden', 'idle', 'loading', 'success', 'error']),
      mode: z.enum(['light', 'dark']),
      background: backgroundSchema.optional(),
      membersBackground: backgroundSchema.optional(),
    })
    .nullish(),
});
export type RoomMetadata = z.infer<typeof roomMetadataSchema>;

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  playlistId: z.string().nullish(),
  trackId: z.string().nullish(),
  ownerId: z.string(),
  metadata: roomMetadataSchema,
});
export type RoomSchema = z.infer<typeof roomSchema>;
