import type { BasePlugin } from '../base-plugin';
import { usePluginProvider } from '../components';
import { usePluginsStore } from '../store';

export function usePluginSettings<
  TController extends BasePlugin,
  // @ts-expect-error: Private property in BasePlugin
  TState extends TController['settings'] = TController['settings'],
>(): TState | undefined {
  const { name } = usePluginProvider();
  return usePluginsStore(
    (state) => state.plugins.find((p) => p.name === name)?.settings,
  ) as TState | undefined;
}
