import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import React from 'react';

export default function NavTop() {
  return (
    <div className="fixed w-full z-50 left-0 top-0 h-[var(--nav-top-height)] border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto h-full flex items-center">
        <div className="flex-1">
          <div className="size-10 rounded-lg bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-900"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full" variant={'outline'}>
            Create Room
          </Button>
          <Button className="rounded-full" asChild>
            <Link href={'/login'}>Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
