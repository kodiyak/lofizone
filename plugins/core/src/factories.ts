import type { ZodSchema } from 'zod';
import type { Plugin, PluginAPI } from './types';

function definePlugin<
  TSettingsSchema extends ZodSchema<any>,
  TStateSchema extends ZodSchema<any>,
>(plugin: Plugin<TSettingsSchema, TStateSchema>) {
  return plugin;
}

function definePluginAPI(api: PluginAPI) {
  return api;
}

export { definePlugin, definePluginAPI };
