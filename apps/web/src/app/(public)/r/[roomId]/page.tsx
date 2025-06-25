import React from 'react';
import RoomProvider from '@/components/providers/room-provider';
import RoomPage from '@/components/pages/room-page';

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: Props) {
  const { roomId } = await params;

  return (
    <RoomProvider roomId={roomId}>
      <RoomPage roomId={roomId} />
    </RoomProvider>
  );
}
