import type { BasePlugin } from '../base-plugin';
import { usePluginProvider } from '../components';
import { usePluginsStore } from '../store';

export function usePluginController<
  TController extends BasePlugin = BasePlugin,
>(): TController | undefined {
  const { name } = usePluginProvider();
  return usePluginsStore(
    (state) => state.plugins.find((p) => p.name === name)?.controller,
  ) as TController | undefined;
}
