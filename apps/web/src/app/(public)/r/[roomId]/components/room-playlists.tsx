import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { StopIcon } from '@phosphor-icons/react';
import { Api } from '@workspace/core';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@workspace/ui/components/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { PlayIcon } from 'lucide-react';
import React from 'react';

interface RoomPlaylistsProps {
  room: Api.Room;
}

export default function RoomPlaylists({ room }: RoomPlaylistsProps) {
  const { playlistId } = room;
  const { data: playlists = [] } = useBackendAPI<Api.Playlist[]>(`/playlists`);

  return (
    <>
      <Command className="rounded-none bg-transparent">
        <CommandInput placeholder={'Search tracks or playlists...'} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tracks">
            {playlists.map((playlist) => (
              <CommandItem
                onSelect={() => {}}
                disabled={playlistId === playlist.id}
                key={playlist.id}
                value={playlist.id}
              >
                <div className="flex-1 flex flex-col">
                  <span className="flex-1 text-left">{playlist.title}</span>
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
        </CommandList>
      </Command>
    </>
  );
}
