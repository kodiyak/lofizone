'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
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

export default function NavTrackPlayer() {
  const isConnected = useRoomStore((state) => state.isConnected);
  const track = useRoomStore((state) => state.track);
  const pause = useRoomStore((state) => state.pause);
  const resume = useRoomStore((state) => state.resume);
  const seek = useRoomStore((state) => state.seek);
  const { currentTime, duration, isPlaying } = useRoomStore(
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
        <Button variant={'outline'} size={'sm'} className="w-full">
          Explore Rooms
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full gap-1">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-1 justify-start items-center gap-2.5">
            {track?.metadata?.background?.url && (
              <Avatar className="size-5 rounded-sm bg-transparent">
                <AvatarImage
                  src={track.metadata.background.url}
                  alt={track.title}
                />
                <AvatarFallback className="rounded-sm bg-muted animate-pulse" />
              </Avatar>
            )}
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
        <SliderPlayer
          value={progress !== undefined ? [progress] : []}
          min={0}
          max={100}
          onValueChange={([v]) => {
            setDragging(true);
            setProgress(v);
          }}
          onValueCommit={([v]) => {
            setDragging(false);
            const newTime = (v / 100) * duration;
            seek(newTime);
          }}
        />
      </div>
    </>
  );
}
