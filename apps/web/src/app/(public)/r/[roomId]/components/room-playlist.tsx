'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
import { PlayIcon, StopIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function RoomPlaylist() {
  const tracks = useRoomStore((state) => state.tracks);
  const playTrack = useRoomStore((state) => state.playTrack);
  const trackId = useRoomStore((state) => state.track?.id);

  return (
    <>
      <div className="flex flex-col gap-1">
        {tracks.map((track, t) => (
          <Button
            variant={'outline'}
            key={track.id}
            disabled={trackId === track.id}
            onClick={() => playTrack(track)}
          >
            {trackId === track.id ? (
              <StopIcon className="fill-foreground" />
            ) : (
              <PlayIcon />
            )}
            <span className="flex-1 text-left">{track.title}</span>
          </Button>
        ))}
      </div>
    </>
  );
}
