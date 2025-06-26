import type { ZodSchema } from 'zod';
import type { Plugin } from './types';

function definePlugin<T extends ZodSchema<any>>(plugin: Plugin<T>) {
  return plugin;
}

export { definePlugin };
