import type { UiBackground as UiBackgroundProps } from '@/lib/controllers/ui.controller';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import React from 'react';

export default function UiBackground({
  className,
  gradients,
  imgClassName,
  src,
  style,
}: UiBackgroundProps) {
  return (
    <>
      <div className={cn('absolute', className)}>
        {gradients?.map((gradient, index) => (
          <div
            key={index}
            className={cn('size-full absolute inset-0', gradient.className)}
          ></div>
        ))}
        {src && (
          <Image
            src={src}
            alt={'Background 01'}
            width={1920}
            height={1080}
            className={cn(imgClassName)}
          />
        )}
      </div>
    </>
  );
}
