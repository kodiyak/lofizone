'use client';

import React from 'react';
import TracksCommand from '@/components/tracks-command';
import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomController } from '@/lib/store/use-room-controller';
import type { Api } from '@workspace/core';

export default function RoomTracks() {
  const trackId = useRoomController((state) => state.track?.id);
  const room = useRoomController((state) => state.room);
  const controller = useRoomController((state) => state.controller);
  const { data: tracks = [] } = useBackendAPI<Api.Track[]>(
    `/playlists/${room?.playlistId}/tracks`,
  );

  return (
    <>
      <TracksCommand
        tracks={tracks}
        value={trackId ? [trackId] : []}
        listClassName="h-auto overflow-y-auto max-h-auto"
        onChange={async (track) => {
          const newTrackId = track.pop();
          if (!newTrackId) return;
          await controller.play(newTrackId);
        }}
      />
    </>
  );
}
