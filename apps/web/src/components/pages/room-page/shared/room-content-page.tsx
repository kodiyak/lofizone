import React, { type PropsWithChildren } from 'react';
import { ScrollArea } from '@workspace/ui/components/scroll-area';

interface RoomContentPageProps {
  title: string;
}

export default function RoomContentPage({
  title,
  children,
}: PropsWithChildren<RoomContentPageProps>) {
  return (
    <>
      <div className="size-full overflow-hidden flex flex-col">
        <div className="p-4">
          <div className="h-12 rounded-xl flex items-center gap-4 bg-background border backdrop-blur-xs px-6">
            <span className="text-sm font-mono">{title}</span>
          </div>
        </div>
        <div className="relative overflow-hidden flex-1">
          <ScrollArea className="absolute inset-0 size-full">
            {children}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
