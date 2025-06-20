'use client';

import Image from 'next/image';
import React from 'react';
import Wallpaper from '@/assets/images/wallpaper-2.webp';
import { Button } from '@workspace/ui/components/button';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { Badge } from '@workspace/ui/components/badge';

export default function RoomCard() {
  return (
    <>
      <div className="flex flex-col rounded-xl border relative">
        <Image
          src={Wallpaper}
          alt={'Lofi'}
          width={280}
          className="w-full aspect-[12/8] rounded-xl border-b object-cover"
        />
        <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-transparent to-background z-20 rounded-xl flex flex-col">
          <div className="flex justify-between text-sm py-2 px-4">
            <span className="font-semibold">Lofi Room</span>
            <span className="text-muted-foreground ml-2">
              <Badge variant={'muted'} className="px-0.5">
                <span className="px-1 py-0.5 bg-background rounded-sm">2</span>5
              </Badge>
            </span>
          </div>
          <div className="flex-1"></div>
          <div className="flex justify-end">
            <Button variant={'link'}>
              <span>Join Room</span>
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
