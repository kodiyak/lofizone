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

interface RoomConnectedCardProps {
  room: Api.Room;
}

export default function RoomConnectedCard({ room }: RoomConnectedCardProps) {
  const session = authClient.useSession();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Room</CardTitle>
          <CardDescription>
            Join us for a relaxing session of lofi music and chill vibes.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-2">
          <RoomMembers />
        </CardContent>
        {room.playlistId ? (
          <>{session?.data ? <RoomPlaylist /> : <RoomDiscordJoin />}</>
        ) : (
          <RoomPlaylists room={room} />
        )}
      </Card>
    </>
  );
}
