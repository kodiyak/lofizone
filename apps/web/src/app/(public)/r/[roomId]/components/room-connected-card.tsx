import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';
import RoomDiscordJoin from './room-discord-join';
import RoomMembers from './room-members';
import RoomPlaylist from './room-playlist';
import { authClient } from '@/lib/authClient';
import type { Api } from '@workspace/core';
import RoomPlaylists from './room-playlists';
import { useRoomStore } from '@/lib/store/use-room-store';

interface RoomConnectedCardProps {
  room: Api.Room;
}

export default function RoomConnectedCard({
  room: pageRoom,
}: RoomConnectedCardProps) {
  const { data: session } = authClient.useSession();
  const room = useRoomStore((state) => state.room);

  return (
    <>
      <Card className="pb-0">
        <CardHeader>
          <CardTitle>Welcome to the Room</CardTitle>
          <CardDescription>
            Join us for a relaxing session of lofi music and chill vibes.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-2">
          <RoomMembers />
          {!session && <RoomDiscordJoin />}
        </CardContent>
        {room?.playlistId ? (
          <RoomPlaylist />
        ) : (
          <>{room && <RoomPlaylists room={room} />}</>
        )}
      </Card>
    </>
  );
}
