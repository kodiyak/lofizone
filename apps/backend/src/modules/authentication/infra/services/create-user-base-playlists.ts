import { db } from '@/shared/clients/db';
import { generatePlaylistId } from '@workspace/core';

async function createUserBasePlaylists(userId: string) {
  const playlists = [
    {
      id: generatePlaylistId(),
      name: 'Favorites',
      slug: `favorites-${userId}`,
      type: 'my_favorite' as const,
      description: 'Your favorite tracks',
      ownerId: userId,
      metadata: {},
    },
    {
      id: generatePlaylistId(),
      name: 'My Uploads',
      slug: `uploads-${userId}`,
      type: 'my_uploaded' as const,
      description: 'Tracks you have recently played',
      ownerId: userId,
      metadata: {},
    },
    {
      id: generatePlaylistId(),
      name: 'Liked Songs',
      slug: `liked-songs-${userId}`,
      type: 'my_liked' as const,
      description: 'Songs you have liked',
      ownerId: userId,
      metadata: {},
    },
  ];

  for (const playlist of playlists) {
    const playlistsCount = await db.playlist.count({
      where: {
        ownerId: userId,
        type: playlist.type,
      },
    });
    if (playlistsCount > 0) {
      continue;
    }

    console.log(`[${userId}] Creating playlist: ${playlist.name}`);
    await db.playlist.create({
      data: playlist,
    });
  }
}

export { createUserBasePlaylists };
