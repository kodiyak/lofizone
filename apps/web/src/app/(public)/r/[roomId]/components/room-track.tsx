'use client';

import Wallpaper from '@/assets/images/wallpaper-2.webp';
import { useRoomStore } from '@/lib/store/use-room-store';
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import { StepBackIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function RoomTrack() {
  const track = useRoomStore((state) => state.track);
  const pause = useRoomStore((state) => state.pause);
  const resume = useRoomStore((state) => state.resume);
  const { isPlaying, currentTime, duration } = useRoomStore(
    (state) => state.audioState,
  );
  const progress = (currentTime / duration) * 100 || 0;

  return (
    <>
      <div className="relative rounded-2xl border overflow-hidden z-10">
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
          src={Wallpaper}
          alt={'Lofi'}
          className="w-full h-[32vh] object-cover object-center"
        />
      </div>
    </>
  );
}
