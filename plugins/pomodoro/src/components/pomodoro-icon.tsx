import type { PluginIconProps } from '@plugins/core';
import { TimerIcon } from '@phosphor-icons/react';
import { cn } from '@workspace/ui/lib/utils';

export default function PomodoroIcon({ className }: PluginIconProps) {
  return (
    <>
      <TimerIcon className={cn(className)} />
    </>
  );
}
