'use client';

import type { Api } from '@workspace/core';
import { Plugin, type PluginWidgetProps } from '../types';
import React, {
  createContext,
  useContext,
  useMemo,
  type ComponentType,
  type PropsWithChildren,
} from 'react';

interface PluginProviderProps {
  plugin: Api.Plugin;
  room: Api.Room;
  plugins: Record<string, Plugin<any>>;
}
interface PluginContextProps extends PluginProviderProps {
  id?: string;
}

const PluginContext = createContext<PluginContextProps>(
  {} as PluginContextProps,
);

const dynamicComponents = new Map<string, ComponentType<PluginWidgetProps>>();
function loadComponent(plugin: Plugin<any>): ComponentType<PluginWidgetProps> {
  if (dynamicComponents.has(plugin.id)) {
    return dynamicComponents.get(plugin.id) as ComponentType<PluginWidgetProps>;
  }

  const Component = plugin.components.Widget;
  dynamicComponents.set(plugin.id, Component);
  return Component;
}

export function PluginProvider(props: PropsWithChildren<PluginProviderProps>) {
  const { plugin, room, plugins } = props;
  const Component = useMemo(() => {
    return loadComponent(plugins[plugin.id]);
  }, [plugin.id, plugins]);

  return (
    <PluginContext.Provider value={{ plugin, room, plugins }}>
      <Component key={`plugin.${plugin.id}`} {...props} />
    </PluginContext.Provider>
  );
}

export const usePluginContext = () => {
  return useContext(PluginContext);
};
