'use client';

import { useUiStore } from '@/lib/store/use-ui-store';
import { cn } from '@workspace/ui/lib/utils';
import React from 'react';
import UiBackground from '../ui-background';

export default function BackgroundProvider() {
  const background = useUiStore((state) => state.background);
  const backgroundState = useUiStore((state) => state.backgroundState);
  const backgroundStateClass = {
    hidden: 'opacity-0',
    idle: 'from-muted via-transparent/10 to-transparent',
    loading: 'animate-pulse from-muted via-transparent/20 to-transparent',
    success: 'from-success/20 via-transparent/10 to-transparent',
    error: 'from-destructive/20 via-transparent/10 to-transparent',
  }[backgroundState];

  return (
    <>
      <div className="fixed size-full inset-0 -z-10">
        <div
          className={cn(
            'w-[100%] h-[100%] fixed inset-0 translate-y-1/2 rounded-[50%] z-20 bg-transparent bg-radial transition-all',
            backgroundStateClass,
          )}
        ></div>

        <UiBackground {...background} />
      </div>
    </>
  );
}
