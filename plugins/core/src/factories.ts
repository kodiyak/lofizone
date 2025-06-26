import type { ZodSchema } from 'zod';
import type { Plugin, PluginAPI } from './types';

function definePlugin<T extends ZodSchema<any>>(plugin: Plugin<T>) {
  return plugin;
}

function definePluginAPI(api: PluginAPI) {
  return api;
}

export { definePlugin, definePluginAPI };
