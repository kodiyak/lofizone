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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Separator } from '@workspace/ui/components/separator';

export default function RoomConnectedCard() {
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
        {!session && (
          <>
            <CardContent className="gap-2">{<RoomDiscordJoin />}</CardContent>
            <Separator className="-mt-2 -mb-4" />
          </>
        )}
        <Tabs defaultValue={!room || room?.playlistId ? 'tracks' : 'playlists'}>
          <TabsList className="px-6">
            <TabsTrigger value="tracks" disabled={!room?.playlistId}>
              Tracks
            </TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="password">Participants</TabsTrigger>
          </TabsList>
          <TabsContent value="tracks">
            <RoomPlaylist />
          </TabsContent>
          <TabsContent value="playlists">
            {room && <RoomPlaylists room={room} />}
          </TabsContent>
          <TabsContent value="password" className="px-1 pb-1">
            <RoomMembers />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
