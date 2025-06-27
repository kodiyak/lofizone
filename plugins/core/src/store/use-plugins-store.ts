import { create } from 'zustand';
import type { BasePlugin } from '../base-plugin';

interface PluginState {
  id: string;
  name: string;
  controller: BasePlugin;
  settings: any;
  state: any;
}

interface PluginsStore {
  plugins: PluginState[];
}

export const usePluginsStore = create<PluginsStore>((set) => ({
  plugins: [],
}));
