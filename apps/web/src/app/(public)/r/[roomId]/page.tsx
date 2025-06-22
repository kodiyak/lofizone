import React from 'react';
import RoomProvider from '@/components/providers/room-provider';
import RoomCard from './components/room-card';

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: Props) {
  const { roomId } = await params;

  return (
    <RoomProvider roomId={roomId}>
      <RoomCard roomId={roomId} />
    </RoomProvider>
  );
}
