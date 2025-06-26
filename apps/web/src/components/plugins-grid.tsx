import type { Api } from '@workspace/core';
import { PluginProvider } from '@plugins/core';
import { availablePlugins } from '@/lib/available-plugins';

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
            plugins={availablePlugins}
          />
        </div>
      ))}
    </>
  );
}
