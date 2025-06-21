import { z } from 'zod';

export const roomMetadataSchema = z.object({
  theme: z.string(),
});
export type RoomMetadata = z.infer<typeof roomMetadataSchema>;

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  metadata: roomMetadataSchema,
});
export type RoomSchema = z.infer<typeof roomSchema>;
