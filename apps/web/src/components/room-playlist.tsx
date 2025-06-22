'use client';

import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomStore } from '@/lib/store/use-room-store';
import { PlayIcon, StopIcon } from '@phosphor-icons/react';
import { Api } from '@workspace/core';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

interface RoomPlaylistProps {
  roomId: string;
}

export default function RoomPlaylist({ roomId }: RoomPlaylistProps) {
  const { data } = useBackendAPI<Api.Track[]>(`/rooms/${roomId}/playlist`);
  const tracks = data || [];
  const setTrack = useRoomStore((state) => state.setTrack);
  const trackId = useRoomStore((state) => state.track?.id);

  return (
    <>
      <div className="flex flex-col gap-1">
        {tracks.map((track, t) => (
          <Button
            variant={'outline'}
            key={track.id}
            disabled={trackId === track.id}
            onClick={() => setTrack(track)}
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
