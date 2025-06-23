import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { useRoomStore } from '@/lib/store/use-room-store';
import { PlaylistIcon, StopIcon } from '@phosphor-icons/react';
import { Api } from '@workspace/core';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@workspace/ui/components/command';
import { PlayIcon } from 'lucide-react';
import React from 'react';

interface RoomPlaylistsProps {
  room: Api.Room;
}

export default function RoomPlaylists({ room }: RoomPlaylistsProps) {
  const { playlistId } = room;
  const { data: playlists = [] } = useBackendAPI<Api.Playlist[]>(`/playlists`);
  const updatePlaylist = useRoomStore((state) => state.updatePlaylist);

  return (
    <>
      <Command className="rounded-none bg-transparent">
        <CommandInput placeholder={'Search playlists...'} />
        <CommandList className="h-full">
          <CommandGroup
            heading={playlists.length > 0 ? 'Playlists' : 'No Playlists.'}
          >
            {playlists.map((playlist) => (
              <CommandItem
                onSelect={() => {
                  updatePlaylist(playlist.id);
                }}
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
        </CommandList>
      </Command>
    </>
  );
}
