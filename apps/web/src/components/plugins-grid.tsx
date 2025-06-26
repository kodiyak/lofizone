import type { Api } from '@workspace/core';
import { PluginProvider } from '@plugins/core';
import pomodoro from '@plugins/pomodoro';
import React from 'react';

interface PluginsGridProps {
  room: Api.Room;
}

export default function PluginsGrid({ room }: PluginsGridProps) {
  return (
    <>
      {room.plugins.map((plugin) => (
        <div>
          <PluginProvider
            plugin={plugin}
            room={room}
            plugins={{
              'pomodoro-plugin': pomodoro,
            }}
          />
        </div>
      ))}
    </>
  );
}
