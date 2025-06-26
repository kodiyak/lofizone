import type { Plugin } from './types';

export class PluginsRegistry {
  private plugins = new Map<string, Plugin<any, any>>();

  static instance: PluginsRegistry;

  private constructor() {}

  static getInstance(): PluginsRegistry {
    if (!PluginsRegistry.instance) {
      PluginsRegistry.instance = new PluginsRegistry();
    }
    return PluginsRegistry.instance;
  }

  register(plugin: Plugin<any, any>) {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin with name ${plugin.name} is already registered.`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  getPlugin(name: string): Plugin<any, any> | undefined {
    return this.plugins.get(name);
  }
}
