import type { Api } from '@workspace/core';
import React from 'react';
import { PluginProvider } from '../providers/plugin-provider';

interface PluginsGridProps {
  room: Api.Room;
}

export default function PluginsGrid({ room }: PluginsGridProps) {
  return (
    <>
      {room.plugins.map((plugin) => (
        <div>
          <PluginProvider plugin={plugin} room={room} />
        </div>
      ))}
    </>
  );
}
