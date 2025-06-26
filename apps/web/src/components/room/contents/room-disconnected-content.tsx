import { useRoomController } from '@/lib/store/use-room-controller';
import type { Api } from '@workspace/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';
import RoomContentPage from '../components/room-content-page';

interface RoomDisconnectedContentProps {
  room: Api.Room;
}

export default function RoomDisconnectedContent({
  room,
}: RoomDisconnectedContentProps) {
  const controller = useRoomController((state) => state.controller);
  return (
    <>
      <RoomContentPage title={'Disconnected'}>
        <div className="size-full py-96 relative flex flex-col items-center justify-center">
          <div className="flex flex-col relative gap-6 z-20">
            <Card className="dark:bg-background dark:bg-gradient-to-br dark:from-background dark:to-muted/5 border-border py-2 ring-2 ring-ring/20">
              <CardContent className="flex-row items-stretch px-2 gap-3">
                <Avatar className="size-16 rounded-2xl border border-border">
                  <AvatarImage />
                  <AvatarFallback className="rounded-lg" />
                </Avatar>
                <div className="flex flex-col flex-1 justify-between py-1.5 pr-4">
                  <CardTitle>{room.name || 'Room Disconnected'}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={'success'}>Connected</Badge>
                    <Badge variant={'muted'}>20 participants</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  controller.connect(room.roomId);
                }}
              >
                Join Room
              </Button>
            </div>
          </div>
        </div>
      </RoomContentPage>
    </>
  );
}
