import { PluginApi } from '@/modules/plugins/domain';

function getPluginApi() {
  return PluginApi.getInstance();
}

export { getPluginApi };
