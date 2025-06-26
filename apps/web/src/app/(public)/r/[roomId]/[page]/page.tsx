import React from 'react';
import RoomProvider from '@/components/providers/room-provider';
import RoomPage from '@/components/room';

interface Props {
  params: Promise<{
    roomId: string;
    page: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { roomId, page } = await params;

  return (
    <RoomProvider roomId={roomId}>
      <RoomPage roomId={roomId} page={page} />
    </RoomProvider>
  );
}
