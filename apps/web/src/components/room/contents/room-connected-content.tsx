import React from 'react';
import RoomContentPage from '../components/room-content-page';
import RoomHomeScreen from '../screens/room-home-screen';
import RoomPluginsScreen from '../screens/room-plugins-screen';
import type { RoomScreenProps } from '../types';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

export default function RoomConnectedContent({ room, page }: RoomScreenProps) {
  const screens = {
    '': RoomHomeScreen,
    home: RoomHomeScreen,
    plugins: RoomPluginsScreen,
  };

  const Screen = page ? screens[page as keyof typeof screens] : RoomHomeScreen;

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
