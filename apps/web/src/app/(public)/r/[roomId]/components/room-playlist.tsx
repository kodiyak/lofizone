'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
import { PlayIcon, StopIcon } from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { cn } from '@workspace/ui/lib/utils';
import React from 'react';

export default function RoomPlaylist() {
  const tracks = useRoomStore((state) => state.tracks);
  const playTrack = useRoomStore((state) => state.playTrack);
  const trackId = useRoomStore((state) => state.track?.id);

  return (
    <>
      <Command className="rounded-none bg-transparent">
        <CommandInput placeholder={'Search tracks...'} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tracks">
            {tracks.map((track, t) => (
              <CommandItem
                onSelect={() => {
                  playTrack(track);
                }}
                key={t}
                value={track.id}
                disabled={trackId === track.id}
                className={cn('rounded-lg', track.id === trackId && 'bg-muted')}
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
                  {trackId === track.id ? (
                    <PlayIcon weight="fill" />
                  ) : (
                    <PlayIcon />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </>
  );
}
