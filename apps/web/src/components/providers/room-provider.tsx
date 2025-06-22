'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
import { Button } from '@workspace/ui/components/button';
import React, { useEffect, type PropsWithChildren } from 'react';

interface RoomProviderProps {
  roomId: string;
}

export default function RoomProvider({
  roomId,
  children,
}: PropsWithChildren<RoomProviderProps>) {
  const connect = useRoomStore((state) => state.connect);
  useEffect(() => {
    if (roomId) {
      connect(roomId);
    }
  }, [roomId]);

  return <>{children}</>;
}
