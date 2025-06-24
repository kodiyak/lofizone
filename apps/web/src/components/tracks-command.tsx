import { PlayIcon } from '@phosphor-icons/react';
import type { Api } from '@workspace/core';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@workspace/ui/components/avatar';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { cn } from '@workspace/ui/lib/utils';
import React, { type ReactNode } from 'react';

interface TracksCommandProps {
  tracks: Api.Track[];
  onChange?: (value: string[]) => void;
  onGoBack?: () => void;
  value?: string[];
  footer?: ReactNode;
  className?: string;
  listClassName?: string;
  autoFocus?: boolean;
}

export default function TracksCommand({
  tracks,
  footer,
  onChange,
  value: trackIds,
  className,
  listClassName,
  onGoBack,
  autoFocus,
}: TracksCommandProps) {
  const isSelected = (trackId: string) => {
    return trackIds?.includes(trackId);
  };
  return (
    <>
      <Command className={cn('rounded-none bg-transparent', className)}>
        <CommandInput
          placeholder={'Search tracks...'}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !e.currentTarget.value) {
              onGoBack?.();
            }
          }}
        />
        <CommandList className={cn('h-[300px]', listClassName)}>
          <CommandGroup heading={tracks.length > 0 ? 'Tracks' : 'No Tracks.'}>
            {tracks.map((track, t) => (
              <CommandItem
                onSelect={() => {
                  if (trackIds?.includes(track.id)) {
                    onChange?.(trackIds.filter((id) => id !== track.id));
                  } else {
                    onChange?.([...(trackIds || []), track.id]);
                  }
                }}
                key={t}
                value={track.id}
                className={cn(isSelected(track.id) && 'bg-muted')}
              >
                {track?.metadata?.background?.url && (
                  <Avatar className="size-8 rounded-sm bg-transparent">
                    <AvatarImage
                      src={track.metadata.background.url}
                      alt={track.title}
                    />
                    <AvatarFallback className="rounded-sm bg-muted animate-pulse" />
                  </Avatar>
                )}
                <div className="flex-1 flex flex-col">
                  <span className="flex-1 text-left">{track.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {'Shinobu - Lofi Beats'}
                  </span>
                </div>
                <div className="opacity-50 fill-muted-foreground text-muted-foreground">
                  {isSelected(track.id) ? (
                    <PlayIcon weight="fill" />
                  ) : (
                    <PlayIcon />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          {footer}
        </CommandList>
      </Command>
    </>
  );
}
