'use client';

import CreatePlaylist from '@/components/create-playlist';
import PlaylistCard from '@/components/playlist-card';
import { Button } from '@workspace/ui/components/button';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import React from 'react';

export default function Page() {
  const createPlaylist = useDisclosure();

  return (
    <>
      <CreatePlaylist {...createPlaylist} />
      <div className="flex flex-col py-4">
        <div className="container mx-auto min-h-screen flex flex-col gap-8">
          <div className="flex items-center p-4 rounded-3xl bg-background/40 border">
            <div className="flex flex-col flex-1 pl-4">
              <h1 className="text-2xl font-bold">Playlists Library</h1>
            </div>
            <Button onClick={createPlaylist.onOpen}>Create Playlist</Button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlaylistCard key={`card.${i}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
