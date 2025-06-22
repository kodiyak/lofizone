import { env } from '@/env';
import type { AlbumSchema, ArtistSchema } from '@/modules/vibes-management';
import { db } from '@/shared/clients/db';
import { s3Client } from '@/shared/clients/s3';
import { temp } from '@/utils/path';
import {
  generateAlbumId,
  generateArtistId,
  generatePlaylistId,
  generateRoomId,
  generateTrackId,
} from '@workspace/core';
import { readFileSync } from 'fs';

async function cleanup() {
  // Delete in order to avoid foreign key constraint errors
  await db.track.deleteMany({});
  await db.album.deleteMany({});
  await db.artist.deleteMany({});
  await db.room.deleteMany({});
  await db.playlist.deleteMany({});
}

async function createArtist() {
  const artistId = generateArtistId();
  const avatarPath = [env.s3.bucket, 'artists', artistId, 'avatar.webp'].join('/');
  await s3Client.putObject(avatarPath, readFileSync(temp('avatar.webp')), 'image/webp');
  const payload: ArtistSchema = {
    id: artistId,
    name: 'Sample Artist',
    metadata: { image: avatarPath },
  };

  return db.artist.create({ data: payload });
}

async function createAlbum(artistId: string, cover: string) {
  const albumId = generateAlbumId();
  const coverPath = [env.s3.bucket, 'albums', albumId, 'cover.webp'].join('/');
  await s3Client.putObject(coverPath, readFileSync(temp(cover)), 'image/webp');
  const payload: AlbumSchema = {
    id: albumId,
    title: 'Chill Vibes',
    metadata: { cover: coverPath },
  };

  return db.album.create({
    data: {
      ...payload,
      artists: { connect: { id: artistId } },
    },
  });
}

async function createTrack(artistId: string, albumId: string, track: string) {
  const trackId = generateTrackId();
  const trackPath = [env.s3.bucket, 'tracks', trackId, 'audio.mp3'].join('/');
  await s3Client.putObject(trackPath, readFileSync(temp('tracks', track)), 'audio/mpeg');

  return db.track.create({
    data: {
      id: trackId,
      title: `Track ${trackId}`,
      duration: 180, // Example duration in seconds
      metadata: { audio: trackPath },
      artists: { connect: { id: artistId } },
      album: { connect: { id: albumId } },
    },
  });
}

async function seedTracks() {
  const artist = await createArtist();
  const tracks = ['track-01.mp3', 'track-02.mp3', 'track-03.mp3'];
  for (const t in tracks) {
    const track = tracks[t];
    const cover = `cover-0${parseInt(t) + 1}.webp`;
    const album = await createAlbum(artist.id, cover);
    await createTrack(artist.id, album.id, track);
  }
}

async function seedPlaylists() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await db.playlist.create({
      data: {
        id: generatePlaylistId(),
        name: `Playlist for ${user.id}`,
        owner: { connect: { id: user.id } },
        slug: `playlist-${user.id}`,
        metadata: { cover: null },
        tracks: {
          connect: await db.track.findMany({
            take: 5, // Example to connect 5 random tracks
            select: { id: true },
          }),
        },
      },
    });
  }
}

async function seedRooms() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await db.room.create({
      data: {
        id: generateRoomId(),
        name: `Room for ${user.id}`,
        owner: { connect: { id: user.id } },
        metadata: { cover: null },
      },
    });
  }
}

async function main() {
  await cleanup();
  await seedTracks();
  await seedPlaylists();
  await seedRooms();
  console.log('Database seeded successfully!');
  console.log('You can now start the server with `npm run dev`');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
