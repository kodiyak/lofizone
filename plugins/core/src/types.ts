import type { ComponentType } from 'react';
import type { z, ZodSchema } from 'zod';

export interface PluginWidgetProps {
  pluginId: string;
  roomId: string;
  memberId: string;
  userId?: string | null;
}

export interface Plugin<T extends ZodSchema<any>> {
  id: string;
  schema: T;
  defaultValues: z.infer<T>;
  components: {
    Widget: ComponentType<PluginWidgetProps>;
  };
}
