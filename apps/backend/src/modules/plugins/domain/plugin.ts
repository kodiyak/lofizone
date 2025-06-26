import { z } from 'zod';

export const pluginSchema = z.object({
  id: z.string(),
  name: z.string(),
  installed: z.boolean(),
});
export type PluginSchema = z.infer<typeof pluginSchema>;
