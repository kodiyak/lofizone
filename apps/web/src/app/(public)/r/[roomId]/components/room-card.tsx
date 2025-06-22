'use client';

import RoomMembers from '@/app/(public)/r/[roomId]/components/room-members';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { authClient } from '@/lib/authClient';
import RoomDiscordJoin from './room-discord-join';
import RoomPlaylist from '@/app/(public)/r/[roomId]/components/room-playlist';
import RoomTrack from './room-track';
import { useRoomStore } from '@/lib/store/use-room-store';

interface RoomCardProps {
  roomId: string;
}

export default function RoomCard({ roomId }: RoomCardProps) {
  const session = authClient.useSession();
  const connect = useRoomStore((state) => state.connect);

  return (
    <>
      <div className="container max-w-2xl mx-auto min-h-screen py-32">
        <div className="flex flex-col p-6 gap-6 backdrop-blur-lg z-30 rounded-2xl border">
          <div className="flex justify-between">
            <Button className="rounded-full" variant={'ghost'} asChild>
              <Link href={'/'}>
                <ArrowLeftIcon className="rounded-full bg-muted" />
                <span>Go Back</span>
              </Link>
            </Button>
            <div className="flex flex-col text-right gap-1">
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>5d</span>
                <span>02:24:32</span>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                15/34
              </span>
            </div>
          </div>
          <div className="flex-1">
            <RoomTrack />
          </div>
          <div className="flex-1">
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
              {session?.data ? <RoomPlaylist /> : <RoomDiscordJoin />}
              <CardFooter className="justify-end">
                <Button variant={'outline'} onClick={() => connect(roomId)}>
                  <RefreshCwIcon />
                  <span>Reconnect</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
