import React, { type PropsWithChildren } from 'react';
import {
  ScrollArea,
  ScrollAreaShadow,
} from '@workspace/ui/components/scroll-area';

interface RoomContentPageProps {
  title: string;
}

export default function RoomContentPage({
  title,
  children,
}: PropsWithChildren<RoomContentPageProps>) {
  return (
    <>
      <div className="size-full absolute inset-0 overflow-hidden flex flex-col">
        <div className="p-4">
          <div className="h-12 rounded-xl flex items-center gap-4 bg-background border backdrop-blur-xs px-6">
            <span className="text-sm font-bold">{title}</span>
          </div>
        </div>
        <div className="relative overflow-hidden flex-1">
          <ScrollAreaShadow className="to-background" />
          <ScrollArea className="absolute inset-0 size-full">
            <div className="flex flex-col pt-6 pb-12">{children}</div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
