import { PluginsRegistry } from '@plugins/core';
import { pomodoroPlugin } from '@plugins/pomodoro';

export function buildPluginsRegistry() {
  const registry = PluginsRegistry.getInstance();
  registry.register(pomodoroPlugin);

  return registry;
}
