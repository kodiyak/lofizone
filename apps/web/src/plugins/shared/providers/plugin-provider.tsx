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

interface PluginProviderProps {
  plugin: Api.Plugin;
  room: Api.Room;
}
interface PluginContextProps extends PluginProviderProps {}

const PluginContext = createContext<PluginContextProps>(
  {} as PluginContextProps,
);

const dynamicComponents = new Map<string, ComponentType<any>>();
function loadComponent(pluginId: string): ComponentType<any> {
  if (dynamicComponents.has(pluginId)) {
    return dynamicComponents.get(pluginId) as ComponentType<any>;
  }

  const Component = lazy(() => import(`./../../${pluginId}/content.tsx`));
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
