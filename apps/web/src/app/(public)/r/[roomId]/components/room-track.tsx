import { useRoomStore } from '@/lib/store/use-room-store';
import React from 'react';

export default function RoomTrack() {
  const track = useRoomStore((state) => state.track);

  if (!track) return null;

  return <>{/* <audio controls src={track.metadata.audio} /> */}</>;
}
