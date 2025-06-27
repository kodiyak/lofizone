import type { BasePlugin } from '../base-plugin';
import { usePluginProvider } from '../components';

export function usePluginController<
  TController extends BasePlugin = BasePlugin,
>(): TController | undefined {
  const { controller } = usePluginProvider();
  return controller as TController | undefined;
}
