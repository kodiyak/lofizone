'use client';

import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import React, { useEffect, useState } from 'react';
import { SliderPlayer } from '@workspace/ui/components/slider';
import Link from 'next/link';
import { cn } from '@workspace/ui/lib/utils';
import { useRoomController } from '@/lib/store/use-room-controller';

export default function NavTrackPlayer() {
  const isConnected = useRoomController((state) => state.isConnected);
  const controller = useRoomController((state) => state.controller);
  const track = useRoomController((state) => state.track);
  const { currentTime, duration, isPlaying } = useRoomController(
    (state) => state.audioState,
  );

  const [isDragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isDragging) {
      const newProgress = duration ? (currentTime / duration) * 100 : 0;
      setProgress(newProgress);
    }
  }, [currentTime, duration]);

  if (!isConnected) {
    return (
      <>
        <Button
          variant={'outline'}
          size={'sm'}
          className="w-full self-center h-8 text-xs border-border/50 bg-background/50 backdrop-blur-sm"
          asChild
        >
          <Link href={'/'}>Explore Rooms</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center self-center gap-2 rounded-lg bg-background/50 backdrop-blur-sm h-8 w-full py-0.5 px-1 border">
        <Avatar className="size-6 rounded-sm bg-transparent">
          <AvatarImage
            src={track?.metadata.background?.url}
            alt={track?.title}
          />
          <AvatarFallback className="rounded-sm" />
        </Avatar>
        <div
          className={cn('flex flex-col flex-1 gap-px', !track && 'opacity-50')}
        >
          <div className="flex items-center gap-1.5">
            <div className="flex flex-1 justify-start items-center gap-2.5">
              <span
                className={cn(
                  'text-[10px] font-mono text-center',
                  !track && 'text-muted-foreground select-none',
                )}
              >
                {track?.title || 'No track playing'}
              </span>
            </div>
          </div>
          <SliderPlayer
            value={progress !== undefined ? [progress] : []}
            disabled={!track}
            min={0}
            max={100}
            onValueChange={([v]) => {
              setDragging(true);
              setProgress(v);
            }}
            onValueCommit={([v]) => {
              setDragging(false);
              const newTime = (v / 100) * duration;
              controller.seek(newTime);
            }}
          />
        </div>
        <div className="flex items-center gap-0.5 mr-1.5">
          <Button size={'icon-xxs'} variant={'ghost'}>
            <SkipBackIcon />
          </Button>
          <Button
            size={'icon-xxs'}
            variant={'ghost'}
            onClick={() => {
              if (isPlaying) {
                controller.pause();
              } else {
                controller.resume();
              }
            }}
          >
            {isPlaying ? (
              <PauseIcon weight="fill" />
            ) : (
              <PlayIcon weight="fill" />
            )}
          </Button>
          <Button size={'icon-xxs'} variant={'ghost'}>
            <SkipForwardIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
