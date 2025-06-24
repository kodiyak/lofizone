'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
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

export default function RoomTracks() {
  const tracks = useRoomStore((state) => state.tracks);
  const playTrack = useRoomStore((state) => state.playTrack);
  const trackId = useRoomStore((state) => state.track?.id);
  const room = useRoomStore((state) => state.room);
  const addRoomTrack = useDisclosure();

  return (
    <>
      {room && <AddRoomTracks room={room} {...addRoomTrack} />}
      <TracksCommand
        tracks={tracks}
        value={trackId ? [trackId] : []}
        onChange={(track) => {
          if (trackId === track[0]) {
            return;
          }
          const nextTrackId = track[0];
          const nextTrack = tracks.find((t) => t.id === nextTrackId);
          if (nextTrack) {
            playTrack(nextTrack);
          }
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
