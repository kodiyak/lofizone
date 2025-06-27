import { usePluginProvider } from '../components';
import { usePluginsStore } from '../store';

export function usePluginState<T = any>(): T | undefined {
  const { name } = usePluginProvider();
  return usePluginsStore(
    (state) => state.plugins.find((p) => p.name === name)?.state,
  ) as T | undefined;
}
