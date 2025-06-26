import React from 'react';
import RoomMembers from '../sections/room-members';
import UiBackground from '@/components/ui-background';
import { useUiStore } from '@/lib/store/use-ui-store';
import { cn } from '@workspace/ui/lib/utils';

export default function RoomSidebar() {
  const membersBackground = useUiStore((state) => state.membersBackground);
  return (
    <>
      <div className="size-full overflow-hidden p-4 relative z-10">
        <div className="size-full flex flex-col gap-4 rounded-2xl bg-background/50 border backdrop-blur-xs p-4 relative">
          <UiBackground
            {...membersBackground}
            className={cn(
              membersBackground?.className,
              'rounded-2xl overflow-hidden opacity-50 blur-xs',
            )}
          />
          <div className="flex flex-col gap-2 relative z-20">
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
