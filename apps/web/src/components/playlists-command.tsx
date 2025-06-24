'use client';

import { StopIcon, PlaylistIcon } from '@phosphor-icons/react';
import type { Api } from '@workspace/core';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@workspace/ui/components/command';
import { cn } from '@workspace/ui/lib/utils';
import { PlayIcon } from 'lucide-react';
import React from 'react';

interface PlaylistsCommandProps {
  value?: string;
  onChange?: (value: string) => void;
  onGoBack?: () => void;
  playlists: Api.Playlist[];
  className?: string;
  listClassName?: string;
  actions?: boolean;
  autoFocus?: boolean;
}

export default function PlaylistsCommand({
  playlists,
  className,
  listClassName,
  onChange,
  value: playlistId,
  actions = false,
  onGoBack,
  autoFocus,
}: PlaylistsCommandProps) {
  return (
    <>
      <Command className={cn('rounded-none bg-transparent', className)}>
        <CommandInput
          placeholder={'Search playlists...'}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            // Backspace trigger goBack
            if (e.key === 'Backspace' && !e.currentTarget.value) {
              onGoBack?.();
            }
          }}
        />
        <CommandList className={cn('h-full', listClassName)}>
          <CommandGroup
            heading={playlists.length > 0 ? 'Playlists' : 'No Playlists.'}
          >
            {playlists.map((playlist) => (
              <CommandItem
                onSelect={() => {
                  onChange?.(playlist.id);
                }}
                disabled={playlistId === playlist.id}
                key={playlist.id}
                value={playlist.id}
              >
                <div className="flex-1 flex flex-col">
                  <span className="flex-1 text-left">
                    {playlist.name || 'No Title'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {'Shinobu - Lofi Beats'}
                  </span>
                </div>
                <div className="opacity-50 fill-muted-foreground text-muted-foreground">
                  {playlistId === playlist.id ? (
                    <StopIcon weight="fill" />
                  ) : (
                    <PlayIcon />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          {actions && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem
                  onSelect={() => {
                    // Add your action here
                  }}
                >
                  <PlaylistIcon />
                  <span className="flex-1 text-left">New Playlist</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </>
  );
}
