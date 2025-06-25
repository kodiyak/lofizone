'use client';

import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomController } from '@/lib/store/use-room-controller';
import { Api } from '@workspace/core';
import React from 'react';
import RoomConnectedContent from './contents/room-connected-content';
import RoomDisconnectedContent from './contents/room-disconnected-content';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@workspace/ui/components/resizable';
import RoomSidebar from './sidebars/room-sidebar';

interface RoomPageProps {
  roomId: string;
}

export default function RoomPage({ roomId }: RoomPageProps) {
  const { data: room } = useBackendAPI<Api.Room>(`/rooms/${roomId}`);
  const isConnected = useRoomController((state) => state.isConnected);
  const currentRoom = useRoomController((state) => state.room);

  if (!room) {
    return <>Loading...</>;
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex size-full items-stretch"
      >
        <ResizablePanel className="relative">
          {isConnected && currentRoom && currentRoom.roomId === room.roomId ? (
            <RoomConnectedContent room={room} />
          ) : (
            <RoomDisconnectedContent room={room} />
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel maxSize={25} minSize={20}>
          <RoomSidebar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
