'use client';

import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@workspace/ui/components/command';
import { MusicIcon } from 'lucide-react';
import React from 'react';
import AddRoomTracks from './add-room-tracks';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import TracksCommand from '@/components/tracks-command';
import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomController } from '@/lib/store/use-room-controller';
import type { Api } from '@workspace/core';

export default function RoomTracks() {
  const trackId = useRoomController((state) => state.track?.id);
  const room = useRoomController((state) => state.room);
  const controller = useRoomController((state) => state.controller);
  const addRoomTrack = useDisclosure();
  const { data: tracks = [] } = useBackendAPI<Api.Track[]>(
    `/playlists/${room?.playlistId}/tracks`,
  );

  return (
    <>
      {room && <AddRoomTracks room={room} {...addRoomTrack} />}
      <TracksCommand
        tracks={tracks}
        value={trackId ? [trackId] : []}
        onChange={async (track) => {
          const newTrackId = track.pop();
          if (!newTrackId) return;
          await controller.play(newTrackId);
        }}
        footer={
          <>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={addRoomTrack.onOpen}>
                <MusicIcon />
                <span className="flex-1 text-left">Add Track</span>
              </CommandItem>
            </CommandGroup>
          </>
        }
      />
    </>
  );
}
