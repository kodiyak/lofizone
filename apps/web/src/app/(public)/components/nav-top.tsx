import { Button } from '@workspace/ui/components/button';
import React from 'react';

export default function NavTop() {
  return (
    <div className="fixed w-full z-50 left-0 top-0 h-16 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto h-full flex items-center">
        <div className="flex-1">
          <div className="size-10 rounded-lg bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-900"></div>
        </div>
        <Button className="rounded-full">Create Room</Button>
      </div>
    </div>
  );
}
