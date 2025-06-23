'use client';

import { Button } from '@workspace/ui/components/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import RoomTrack from './room-track';
import { useRoomStore } from '@/lib/store/use-room-store';
import RoomConnectedCard from './room-connected-card';
import RoomConnectCard from './room-connect-card';

interface RoomCardProps {
  roomId: string;
}

export default function RoomCard({ roomId }: RoomCardProps) {
  const isConnected = useRoomStore((state) => state.isConnected);
  const connectedRoomId = useRoomStore((state) => state.room?.roomId);

  return (
    <>
      <div className="container max-w-2xl mx-auto min-h-screen py-32">
        <div className="flex flex-col p-6 gap-6 backdrop-blur-lg z-30 rounded-2xl border">
          <div className="flex justify-between">
            <Button className="rounded-full" variant={'ghost'} asChild>
              <Link href={'/'}>
                <ArrowLeftIcon className="rounded-full bg-muted" />
                <span>Go Back</span>
              </Link>
            </Button>
            <div className="flex flex-col text-right gap-1">
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>5d</span>
                <span>02:24:32</span>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                15/34
              </span>
            </div>
          </div>
          <div className="flex-1">
            <RoomTrack />
          </div>
          <div className="flex-1">
            {isConnected && connectedRoomId === roomId ? (
              <RoomConnectedCard />
            ) : (
              <RoomConnectCard roomId={roomId} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
