import React, { type PropsWithChildren, type ReactNode } from 'react';
import {
  ScrollArea,
  ScrollAreaShadow,
} from '@workspace/ui/components/scroll-area';

interface RoomContentPageProps {
  title: string;
  actions?: ReactNode[];
}

export default function RoomContentPage({
  title,
  children,
  actions,
}: PropsWithChildren<RoomContentPageProps>) {
  return (
    <>
      <div className="size-full absolute inset-0 overflow-hidden flex flex-col">
        <div className="px-4 pt-4">
          <div className="h-12 rounded-xl flex items-center gap-4 bg-background border backdrop-blur-xs px-6">
            <div className="flex-1 flex flex-col">
              <span className="text-sm font-bold">{title}</span>
            </div>
            {actions && actions.length > 0 ? (
              <div className="flex items-center gap-1">{actions}</div>
            ) : null}
          </div>
        </div>
        <div className="relative overflow-hidden flex-1">
          <ScrollAreaShadow className="to-background w-[calc(100%-var(--spacing)*12)] ml-6 data-[slot=scroll-area-shadow-bottom]:opacity-0" />
          <ScrollArea className="absolute inset-0 size-full">
            <div className="flex flex-col pt-6 pb-12 px-6 relative">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
