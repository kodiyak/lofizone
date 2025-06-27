'use client';

import React from 'react';
import DebugEvents from '../debug/debug-events';
import { useRoomController } from '@/lib/store/use-room-controller';

export default function DebugProvider() {
  const controller = useRoomController((state) => state.controller);
  return (
    <>
      <div className="fixed z-50 h-screen top-0 right-0 flex py-4 px-16 flex-col">
        {controller && <DebugEvents />}
      </div>
    </>
  );
}
