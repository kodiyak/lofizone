'use client';

import RoomMembers from '@/app/(public)/r/[roomId]/components/room-members';
import Wallpaper from '@/assets/images/wallpaper-2.webp';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@workspace/ui/components/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { authClient } from '@/lib/authClient';
import RoomDiscordJoin from './room-discord-join';
import RoomPlaylist from '@/app/(public)/r/[roomId]/components/room-playlist';
import RoomTrack from './room-track';

interface RoomCardProps {
  roomId: string;
}

export default function RoomCard({ roomId }: RoomCardProps) {
  const session = authClient.useSession();

  return (
    <>
      <div className="container max-w-2xl mx-auto min-h-screen">
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
            <div className="relative rounded-2xl border overflow-hidden z-10">
              <div className="absolute left-0 top-0 size-full bg-gradient-to-b from-transparent to-background flex flex-col z-10" />
              <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-transparent to-background flex flex-col z-20">
                <div className="flex-1"></div>
                <div className="flex items-center gap-4 p-4 font-mono">
                  <div className="flex flex-col flex-1">
                    <span className="text-lg">Playlist Name</span>
                    <span className="text-xs text-muted-foreground">
                      Shinobu - Lofi Beats
                    </span>
                  </div>
                  <Select value={'en-US'}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        {
                          label: 'USA',
                          value: 'en-US',
                          flag: 'us',
                        },
                        {
                          label: 'Brazil',
                          value: 'pt-BR',
                          flag: 'br',
                        },
                      ].map((lang) => (
                        <SelectItem
                          key={lang.value}
                          value={lang.value}
                          className="flex items-center gap-2"
                        >
                          <img
                            className="size-4 rounded-sm"
                            src={`https://flagcdn.com/w20/${lang.flag}.png`}
                            alt={lang.label}
                          />
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Image
                src={Wallpaper}
                alt={'Lofi'}
                className="w-full h-[32vh] object-cover object-center"
              />
            </div>
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
              <Separator />
              <CardContent>
                <RoomTrack />
              </CardContent>
              <CardContent>
                {session?.data ? <RoomPlaylist /> : <RoomDiscordJoin />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
