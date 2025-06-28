'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card';
import Image from 'next/image';
import React from 'react';
import Wallpaper from '@/assets/images/night-coffee-bg.png';
import { cn } from '@workspace/ui/lib/utils';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { PlaylistIcon, TrashIcon } from '@phosphor-icons/react';

export default function PlaylistCard() {
  return (
    <>
      <Card>
        <CardContent>
          <div className="relative rounded-3xl border bg-background">
            <Image
              src={Wallpaper.src}
              width={800}
              height={500}
              alt={'Wallpaper Lofi'}
              className="w-full aspect-square rounded-3xl object-cover opacity-80"
            />
            <div
              className={cn(
                'absolute gap-4 size-full inset-0 flex flex-col items-center text-center p-6 justify-center',
                'bg-radial from-background via-background/70 to-transparent',
              )}
            >
              <span className="text-3xl font-extralight tracking-wider">
                Chill and Coffee
              </span>
              <span className="text-xs font-mono font-extralight tracking-wider">
                12 musics
              </span>
            </div>
          </div>
        </CardContent>
        <CardHeader>
          <CardDescription>
            A collection of chill lofi beats to enjoy with your coffee.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <ButtonsIcons
            items={[
              {
                label: 'Musics',
                icon: <PlaylistIcon />,
              },
              {
                label: 'Remove',
                icon: <TrashIcon />,
                variant: 'destructive-ghost',
              },
            ]}
          />
        </CardFooter>
      </Card>
    </>
  );
}
