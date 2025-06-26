'use client';

import type { Api } from '@workspace/core';
import React, {
  createContext,
  lazy,
  useContext,
  useMemo,
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import pomodoroPlugin from '@plugins/pomodoro';

interface PluginProviderProps {
  plugin: Api.Plugin;
  room: Api.Room;
}
interface PluginContextProps extends PluginProviderProps {}

const PluginContext = createContext<PluginContextProps>(
  {} as PluginContextProps,
);

const dynamicComponents = new Map<string, ComponentType<any>>();
const plugins = {
  'pomodoro-plugin': pomodoroPlugin,
};
function loadComponent(pluginId: string): ComponentType<any> {
  if (dynamicComponents.has(pluginId)) {
    return dynamicComponents.get(pluginId) as ComponentType<any>;
  }

  // @ts-expect-error: Dynamic import of plugin components
  const Component = plugins[pluginId]?.components.Widget;
  dynamicComponents.set(pluginId, Component);
  return Component;
}

export function PluginProvider(props: PropsWithChildren<PluginProviderProps>) {
  const { plugin, room } = props;
  const Component = useMemo(() => loadComponent(plugin.id), [plugin.id]);

  return (
    <PluginContext.Provider value={{ plugin, room }}>
      <Component key={`plugin.${plugin.id}`} {...props} />
    </PluginContext.Provider>
  );
}

export const usePluginContext = () => {
  return useContext(PluginContext);
};
