import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';
import RoomTracks from './room-tracks';
import { useRoomController } from '@/lib/store/use-room-controller';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import AddRoomTracks from '../components/add-room-tracks';

export default function RoomPlaylist() {
  const addRoomTrack = useDisclosure();
  const room = useRoomController((state) => state.room);

  if (!room) return null;

  return (
    <>
      <AddRoomTracks room={room} {...addRoomTrack} />

      <Card className="flex-1 overflow-hidden">
        <CardHeader className="flex items-center gap-4 px-6">
          <Avatar className="size-16 rounded-2xl border border-border">
            <AvatarFallback className="rounded-xl" />
          </Avatar>
          <CardHeader className="flex-1 px-0">
            <CardTitle>Playlist</CardTitle>
            <CardDescription>{room.name} playlist.</CardDescription>
          </CardHeader>
        </CardHeader>
        <CardContent className="px-2 flex-1 relative overflow-y-auto">
          <RoomTracks />
        </CardContent>
      </Card>
    </>
  );
}
