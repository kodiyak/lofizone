import type { BasePlugin } from '../base-plugin';
import { usePluginProvider } from '../components';
import { usePluginsStore } from '../store';

export function usePluginState<
  TController extends BasePlugin,
  // @ts-expect-error: Private property in BasePlugin
  TState extends TController['state'] = TController['state'],
>(): TState | undefined {
  const { name } = usePluginProvider();
  return usePluginsStore(
    (state) => state.plugins.find((p) => p.name === name)?.state,
  ) as TState | undefined;
}
