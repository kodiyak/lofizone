'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function NavTrackPlayer() {
  const track = useRoomStore((state) => state.track);
  const pause = useRoomStore((state) => state.pause);
  const resume = useRoomStore((state) => state.resume);
  const { currentTime, duration, isPlaying } = useRoomStore(
    (state) => state.audioState,
  );
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-1 justify-start items-center gap-2.5">
            <div className="size-5 rounded-sm bg-muted"></div>
            <span className="text-[11px] font-mono text-center">
              {track?.title || 'No track playing'}
            </span>
          </div>
          <Button size={'icon-xs'} variant={'ghost'}>
            <SkipBackIcon />
          </Button>
          <Button
            size={'icon-xs'}
            variant={'ghost'}
            onClick={() => (isPlaying ? pause() : resume())}
          >
            {isPlaying ? (
              <PauseIcon weight="fill" />
            ) : (
              <PlayIcon weight="fill" />
            )}
          </Button>
          <Button size={'icon-xs'} variant={'ghost'}>
            <SkipForwardIcon />
          </Button>
        </div>
        <div className="h-1 w-full bg-muted rounded-full flex items-center px-0.5">
          <div
            className="h-0.5 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
