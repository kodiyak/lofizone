'use client';

import { useRoomController } from '@/lib/store/use-room-controller';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function RoomConnectCard({ roomId }: { roomId: string }) {
  const controller = useRoomController((state) => state.controller);
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
                controller.connect(roomId);
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
