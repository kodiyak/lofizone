import React from 'react';
import RoomContentPage from '../components/room-content-page';
import RoomHomeScreen from '../screens/room-home-screen';
import RoomPluginsScreen from '../screens/room-plugins-screen';
import type { RoomScreenProps } from '../types';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { useRoomController } from '@/lib/store/use-room-controller';

export default function RoomConnectedContent({ page }: RoomScreenProps) {
  const room = useRoomController((state) => state.room);
  const screens = {
    '': RoomHomeScreen,
    home: RoomHomeScreen,
    plugins: RoomPluginsScreen,
  };
  const Screen = page ? screens[page as keyof typeof screens] : RoomHomeScreen;

  if (!room) return null;

  return (
    <>
      <RoomContentPage
        title={'Connected'}
        actions={[
          {
            label: 'Room',
            href: `/r/${room.roomId}`,
          },
          {
            label: 'Plugins',
            href: `/r/${room.roomId}/plugins`,
          },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            asChild
            className="h-8"
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      >
        <Screen room={room} page={page} />
      </RoomContentPage>
    </>
  );
}
