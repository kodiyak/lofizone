import { useRoomStore } from '@/lib/store/use-room-store';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function RoomTrack() {
  const track = useRoomStore((state) => state.track);
  const pause = useRoomStore((state) => state.pause);
  const resume = useRoomStore((state) => state.resume);

  if (!track) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Button variant={'ghost'} onClick={pause}>
          Pause
        </Button>
        <Button variant={'ghost'} onClick={resume}>
          Play
        </Button>
      </div>
    </>
  );
}
