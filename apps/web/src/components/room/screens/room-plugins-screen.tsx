import { usePluginsProvider } from '@plugins/core';
import React from 'react';
import RoomInstallPluginCard from '../components/room-install-plugin-card';
import { useRoomController } from '@/lib/store/use-room-controller';

export default function RoomPluginsScreen() {
  const { plugins: contextPlugins } = usePluginsProvider();
  const plugins = Object.values(contextPlugins);
  const room = useRoomController((state) => state.room);

  if (!room) return null;

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 max-w-full gap-4">
          {plugins.map((plugin) => (
            <RoomInstallPluginCard
              roomId={room.roomId}
              plugin={plugin}
              isInstalled={!!room?.plugins?.find((p) => p.name === plugin.name)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
