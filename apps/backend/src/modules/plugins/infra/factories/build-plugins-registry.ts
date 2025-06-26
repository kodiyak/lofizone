import { PluginsRegistry } from '@plugins/core';

async function importPlugin(pluginName: string) {
  console.log(`[plugin][${pluginName}] Importing...`);
  try {
    const pluginModule = await import(`@plugins/${pluginName}`);
    console.log(`[plugin][${pluginName}] Loaded successfully`);
    return pluginModule[`${pluginName}Plugin`];
  } catch (error) {
    console.error(`[plugin][${pluginName}] Error:`, error);
    throw new Error(`Plugin ${pluginName} could not be loaded.`);
  }
}

export async function buildPluginsRegistry() {
  const plugins = await Promise.all([await importPlugin('pomodoro')]);
  plugins.forEach((plugin) => {
    PluginsRegistry.getInstance().register(plugin);
  });
}
