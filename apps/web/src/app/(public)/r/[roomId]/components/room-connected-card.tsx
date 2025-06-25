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
import RoomTracks from './room-tracks';
import { authClient } from '@/lib/authClient';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Separator } from '@workspace/ui/components/separator';
import PluginsAccordion from '@/plugins/shared/components/plugins-accordion';
import { useRoomStore } from '@/lib/store/use-room-store';
import PluginsGrid from '@/plugins/shared/components/plugins-grid';

export default function RoomConnectedCard() {
  const { data: session } = authClient.useSession();
  const room = useRoomStore((state) => state.room);
  if (!room) return null;

  return (
    <>
      <Card className="pb-0 overflow-hidden">
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
        <PluginsGrid room={room} />
        <Tabs defaultValue={'tracks'}>
          <TabsList className="px-6">
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="password">Participants</TabsTrigger>
          </TabsList>
          <TabsContent value="tracks">
            <RoomTracks />
          </TabsContent>
          <TabsContent
            value="password"
            className="px-1 min-h-[336px] overflow-y-auto pb-1"
          >
            <RoomMembers />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
