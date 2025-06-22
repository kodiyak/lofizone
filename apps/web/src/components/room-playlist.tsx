import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { Api } from '@workspace/core';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

interface RoomPlaylistProps {
  roomId: string;
}

export default function RoomPlaylist({ roomId }: RoomPlaylistProps) {
  const { data } = useBackendAPI<Api.Track[]>(`/rooms/${roomId}/playlist`);
  const tracks = data || [];

  return (
    <>
      <div className="flex flex-col">
        {tracks.map((track, t) => (
          <Button variant={'outline'} key={track.id}>
            {track.title}
          </Button>
        ))}
      </div>
    </>
  );
}
