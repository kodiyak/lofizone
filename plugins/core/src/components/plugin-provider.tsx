'use client';

import { Plugin } from '../types';
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import { usePluginsProvider } from './plugins-provider';
import type { BasePlugin } from '../base-plugin';

type ComponentName = keyof Plugin<any, any>['components'];
type _EnumerateByComponentName<T extends keyof Plugin<any, any>['components']> =
  ComponentProps<Plugin<any, any>['components'][T]>;
interface PluginProviderProps<
  TName extends ComponentName,
  TController extends BasePlugin = BasePlugin,
> {
  name: string;
  componentName: TName;
  controller?: TController;
}
interface PluginContextProps<TName extends ComponentName = ComponentName>
  extends PluginProviderProps<TName> {
  id?: string;
}

const PluginContext = createContext<PluginContextProps>(
  {} as PluginContextProps,
);

const dynamicComponents = new Map<string, ComponentType<any>>();
function loadComponent(plugin: Plugin<any, any>, name: ComponentName) {
  if (dynamicComponents.has(plugin.name)) {
    return dynamicComponents.get(plugin.name);
  }

  const Component = plugin.components[name];
  dynamicComponents.set([plugin.name, name].join('.'), Component);
  return Component;
}

export function PluginProvider<TName extends ComponentName>(
  props: PropsWithChildren<PluginProviderProps<TName>> &
    _EnumerateByComponentName<TName>,
) {
  const { plugins } = usePluginsProvider();
  const { name, componentName, controller, ...rest } = props;
  const Component = useMemo(() => {
    try {
      return loadComponent(plugins[name], componentName);
    } catch (error) {
      console.error(`Error loading component for plugin "${name}":`, {
        error,
        plugin: plugins[name],
        plugins,
      });
      return null;
    }
  }, [plugins, name, componentName]);

  if (!Component) {
    return <>No PluginProvider Component...</>;
  }

  return (
    <PluginContext.Provider
      value={{ name, componentName, controller, ...rest }}
    >
      <Component key={`plugin.${name}`} {...props} />
    </PluginContext.Provider>
  );
}

export const usePluginProvider = () => {
  return useContext(PluginContext);
};
