'use client';

import Wallpaper from '@/assets/images/wallpaper-2.webp';
import { useRoomController } from '@/lib/store/use-room-controller';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import React from 'react';

interface RoomTrackProps {
  className?: string;
}

export default function RoomTrack({ className }: RoomTrackProps) {
  const track = useRoomController((state) => state.track);
  const { currentTime, duration } = useRoomController(
    (state) => state.audioState,
  );
  const progress = (currentTime / duration) * 100 || 0;

  return (
    <>
      <div
        className={cn(
          'relative rounded-2xl border overflow-hidden z-10',
          className,
        )}
      >
        <div className="absolute left-0 top-0 size-full bg-gradient-to-b from-transparent to-background flex flex-col z-10" />
        <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-transparent to-background flex flex-col z-20">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4 p-4 font-mono">
            <div className="flex flex-col flex-1">
              <span className="text-lg">Playlist Name</span>
              <span className="text-xs text-muted-foreground">
                {track?.title || 'No track playing'}
              </span>
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="h-2 w-full rounded-full bg-muted p-0.5">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <Image
          src={track?.metadata.background?.url || Wallpaper}
          width={1080}
          height={1080}
          alt={'Lofi'}
          className="absolute size-full inset-0 object-cover object-center"
        />
      </div>
    </>
  );
}
