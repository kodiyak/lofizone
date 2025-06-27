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

export const roomPluginSchema = z.object({
  id: z.string(),
  pluginId: z.string(),
  roomId: z.string(),
  settings: z.any(),
  lastState: z.any().nullish(),
  createdAt: z.date(),
});

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  plugins: roomPluginSchema.array().optional(),
  playlistId: z.string().nullish(),
  trackId: z.string().nullish(),
  ownerId: z.string(),
  metadata: roomMetadataSchema,
});
export type RoomSchema = z.infer<typeof roomSchema>;
