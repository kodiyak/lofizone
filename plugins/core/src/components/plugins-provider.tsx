import { createContext, useContext, type PropsWithChildren } from 'react';
import type { Plugin } from '../types';

interface PluginsProviderProps {
  plugins: Record<string, Plugin<any, any>>;
}

interface PluginsContextProps {
  plugins: Record<string, Plugin<any, any>>;
}

const PluginsContext = createContext<PluginsContextProps>(
  {} as PluginsContextProps,
);

export function PluginsProvider({
  plugins,
  children,
}: PropsWithChildren<PluginsProviderProps>) {
  return (
    <>
      <PluginsContext.Provider value={{ plugins }}>
        {children}
      </PluginsContext.Provider>
    </>
  );
}

export const usePluginsProvider = () => useContext(PluginsContext);
