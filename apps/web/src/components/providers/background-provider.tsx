'use client';

import { useUiStore } from '@/lib/store/use-ui-store';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import React from 'react';

export default function BackgroundProvider() {
  const background = useUiStore((state) => state.background);
  const backgroundState = useUiStore((state) => state.backgroundState);
  const backgroundStateClass = {
    hidden: 'opacity-0',
    idle: 'from-muted via-background/10 to-background',
    loading: 'animate-pulse from-muted via-background/20 to-background',
    success: 'from-success/20 via-background/10 to-background',
    error: 'from-destructive/20 via-background/10 to-background',
  }[backgroundState];

  return (
    <>
      <div className="fixed size-full inset-0 -z-10">
        <div
          className={cn(
            'w-[100%] h-[100%] fixed inset-0 translate-y-1/2 rounded-[50%] bg-background bg-radial transition-all',
            backgroundStateClass,
          )}
        ></div>

        <div className={cn('absolute', background?.className)}>
          {background?.gradients?.map((gradient, index) => (
            <div
              key={index}
              className={cn('size-full absolute inset-0', gradient.className)}
            ></div>
          ))}
          {background?.src && (
            <Image
              src={background?.src}
              alt={'Background 01'}
              width={1920}
              height={1080}
            />
          )}
        </div>
      </div>
    </>
  );
}
