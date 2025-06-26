import type { Api } from '@workspace/core';
import { PluginProvider } from '@plugins/core';

interface PluginsGridProps {
  room: Api.Room;
}

export default function PluginsGrid({ room }: PluginsGridProps) {
  return (
    <>
      {room.plugins.map((plugin) => (
        <PluginProvider
          key={`plugin.${plugin.name}`}
          name={plugin.name}
          componentName={'Widget'}
          plugin={plugin}
          room={room}
        />
      ))}
    </>
  );
}
