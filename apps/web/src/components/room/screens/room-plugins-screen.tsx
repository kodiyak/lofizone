import { usePluginsProvider } from '@plugins/core';
import React from 'react';
import RoomInstallPluginCard from '../components/room-install-plugin-card';

export default function RoomPluginsScreen() {
  const { plugins: contextPlugins } = usePluginsProvider();
  const plugins = Object.values(contextPlugins);

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="grid grid-cols-4 max-w-full gap-4">
          {plugins.map((plugin) => (
            <RoomInstallPluginCard plugin={plugin} />
          ))}
        </div>
      </div>
    </>
  );
}
