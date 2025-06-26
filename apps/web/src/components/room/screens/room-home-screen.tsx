import PluginsGrid from '@/components/plugins-grid';
import React from 'react';
import RoomTrack from '../sections/room-track';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import RoomTracks from '../sections/room-tracks';
import type { RoomScreenProps } from '../types';

export default function RoomHomeScreen({ room, page }: RoomScreenProps) {
  return (
    <>
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
              <CardTitle>Playlist - {page}</CardTitle>
              <CardDescription>{room.name} playlist.</CardDescription>
            </CardHeader>
          </div>
          <CardContent className="px-2">
            <RoomTracks />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
