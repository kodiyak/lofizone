import type { Api } from '@workspace/core';
import { PluginProvider } from '@plugins/core';
import { useRoomController } from '@/lib/store/use-room-controller';

interface PluginsGridProps {
  room: Api.Room;
}

export default function PluginsGrid({ room }: PluginsGridProps) {
  const controller = useRoomController((state) => state.controller);
  return (
    <>
      {room.plugins.map((plugin) => (
        <PluginProvider
          key={`plugin.${plugin.name}`}
          name={plugin.name}
          componentName={'Widget'}
          plugin={plugin}
          room={room}
          controller={controller.plugins.getPlugin(plugin.name)?.controller}
        />
      ))}
    </>
  );
}
