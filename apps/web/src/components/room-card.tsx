'use client';

import Image from 'next/image';
import React from 'react';
import Wallpaper from '@/assets/images/wallpaper-2.webp';
import { Button } from '@workspace/ui/components/button';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { Badge } from '@workspace/ui/components/badge';
import Link from 'next/link';
import type { Api } from '@workspace/core';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { BoxesIcon, TimerIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';

interface RoomCardProps {
  room: Api.Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <>
      <Card className="group">
        <CardHeader>
          <CardTitle>{room.name}</CardTitle>
          <CardDescription>12 members online</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          <div className="flex gap-4 items-center">
            <Avatar className="size-20 rounded-3xl">
              <AvatarImage />
              <AvatarFallback className="rounded-3xl" />
            </Avatar>
            <div className="flex flex-col flex-1 gap-1 overflow-hidden">
              <span className="font-medium truncate">Shinobi's Lofi Room</span>
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant={'muted'}>
                  <TimerIcon />
                  <span>Pomodoro</span>
                </Badge>
              </div>
            </div>
          </div>
          <Button variant={'outline'} asChild>
            <Link
              href={`/r/${room.roomId}`}
              className="flex items-center gap-2"
            >
              <span
                className={cn(
                  'transition-all duration-300 ease-in-out translate-x-4',
                  'group-hover:translate-x-0',
                )}
              >
                Join Room
              </span>
              <ArrowRightIcon
                className={cn(
                  'opacity-0 -translate-x-4 transition-all duration-300 ease-in-out',
                  'group-hover:opacity-100 group-hover:translate-x-0',
                )}
              />
            </Link>
          </Button>
          <div className="flex items-center justify-end">
            <Badge variant={'muted'} className="p-0.5 pr-2">
              <Avatar className="size-5">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/000?v=4"
                  alt="User Avatar"
                />
                <AvatarFallback className="" />
              </Avatar>
              <span>Owner Name</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
