'use client';

import React, { type PropsWithChildren } from 'react';

interface RoomProviderProps {
  roomId: string;
}

export default function RoomProvider({
  roomId,
  children,
}: PropsWithChildren<RoomProviderProps>) {
  return <>{children}</>;
}
