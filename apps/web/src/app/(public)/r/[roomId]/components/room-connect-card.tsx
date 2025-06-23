'use client';

import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomStore } from '@/lib/store/use-room-store';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { Api } from '@workspace/core';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function RoomConnectCard({ roomId }: { roomId: string }) {
  const connect = useRoomStore((state) => state.connect);
  const { data: room } = useBackendAPI<Api.Room>(`/rooms/${roomId}`);
  const { data: tracks = [] } = useBackendAPI<Api.Track[]>(
    `/rooms/${roomId}/tracks`,
  );
  const { data: members = [] } = useBackendAPI<Api.RoomMember[]>(
    `/rooms/${roomId}/members`,
  );

  return (
    <>
      <div className="w-full aspect-[10/6] relative overflow-hidden bg-gradient-to-br from-background to-card rounded-xl border">
        <div className="w-[200%] h-[200%] absolute rounded-[50%] bg-gradient-to-b from-muted/50 to-muted border top-0 left-0 -translate-x-1/4 translate-y-1/8 z-10"></div>
        <div className="size-full flex flex-col relative z-20">
          <div className="flex-1"></div>
          <div className="flex justify-end p-2">
            <Button
              variant={'link'}
              onClick={() => {
                connect(roomId);
              }}
            >
              <span>Join Now</span>
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
