import type { Api } from '@workspace/core';
import React from 'react';
import RoomContentPage from '../shared/room-content-page';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import RoomTracks from '../sections/room-tracks';
import PluginsGrid from '@/plugins/shared/components/plugins-grid';
import { Separator } from '@workspace/ui/components/separator';
import RoomTrack from '../sections/room-track';

interface RoomConnectedContentProps {
  room: Api.Room;
}

export default function RoomConnectedContent({
  room,
}: RoomConnectedContentProps) {
  return (
    <>
      <RoomContentPage title={'Connected'}>
        <div className="flex flex-col px-4">
          <div className="flex gap-6 items-stretch">
            <div className="w-[300]">
              <PluginsGrid room={room} />
            </div>
            <RoomTrack className="flex-1" />
          </div>
          <Separator className="my-6" />
          <Card className="pb-2">
            <div className="flex items-center gap-4 px-6">
              <Avatar className="size-16 rounded-2xl border border-border">
                <AvatarFallback className="rounded-xl" />
              </Avatar>
              <CardHeader className="flex-1 px-0">
                <CardTitle>Playlist</CardTitle>
                <CardDescription>{room.name} playlist.</CardDescription>
              </CardHeader>
            </div>
            <CardContent className="px-2">
              <RoomTracks />
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid grid-cols-5 px-4 gap-4"></div> */}
      </RoomContentPage>
    </>
  );
}
