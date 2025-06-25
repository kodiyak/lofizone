import type { Api } from '@workspace/core';
import React from 'react';

interface RoomConnectedContentProps {
  room: Api.Room;
}

export default function RoomConnectedContent({
  room,
}: RoomConnectedContentProps) {
  return (
    <>
      <div className="flex flex-col"></div>
    </>
  );
}
