import React from 'react';
import RoomMembers from '../sections/room-members';

export default function RoomSidebar() {
  return (
    <>
      <div className="size-full overflow-hidden p-4">
        <div className="size-full flex flex-col gap-4 rounded-2xl bg-background/50 border backdrop-blur-xs p-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Members</span>
            <div className="flex flex-col gap-1">
              <RoomMembers />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
