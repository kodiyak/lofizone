import type { Api } from '@workspace/core';
import type { ComponentType } from 'react';
import type { z, ZodSchema } from 'zod';

export interface PluginWidgetProps {
  room: Api.Room;
  plugin: Api.Plugin;
}

export interface Plugin<T extends ZodSchema<any>> {
  id: string;
  schema: T;
  defaultValues: z.infer<T>;
  components: {
    Widget: ComponentType<PluginWidgetProps>;
  };
}
