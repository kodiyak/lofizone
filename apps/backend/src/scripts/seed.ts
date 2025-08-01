import { env } from '@/env';
import { createUserBasePlaylists } from '@/modules/authentication';
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
import kebabCase from 'lodash.kebabcase';

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

  const payload: AlbumSchema = {
    id: albumId,
    title: 'Chill Vibes',
    metadata: {
      cover: await s3Client
        .putObject(coverPath, readFileSync(temp(cover)), 'image/webp')
        .then((res) => res.url),
    },
  };

  return db.album.create({
    data: {
      ...payload,
      artists: { connect: { id: artistId } },
    },
  });
}

async function createTrack(userId: string, artistId: string, albumId: string, track: string) {
  const trackId = generateTrackId();
  const trackPath = [env.s3.bucket, 'tracks', trackId, 'audio.mp3'].join('/');
  const backgroundPath = [env.s3.bucket, 'tracks', trackId, 'background.webp'].join('/');
  return db.track.create({
    data: {
      id: trackId,
      title: `Track ${trackId}`,
      duration: 180, // Example duration in seconds
      uploadedBy: { connect: { id: userId } },
      metadata: {
        background: {
          type: 'image',
          url: await s3Client
            .putObject(backgroundPath, readFileSync(temp('avatar.webp')), 'image/webp')
            .then((res) => res.url),
        },
        audio: await s3Client
          .putObject(trackPath, readFileSync(temp('tracks', track)), 'audio/mpeg')
          .then((res) => res.url),
      },
      artists: { connect: { id: artistId } },
      album: { connect: { id: albumId } },
    },
  });
}

// async function seedTracks(size: number) {
//   const artist = await createArtist();
//   const tracks = ['track-01.mp3', 'track-02.mp3', 'track-03.mp3'];
//   const users = await db.user.findMany({
//     select: { id: true },
//   });

//   for (const user of users) {
//     for (const i in Array.from({ length: size })) {
//       for (const t in tracks) {
//         const index = Number(Number(i) + Number(t));
//         console.log(`Seeding track ${index + 1} for artist ${artist.id}`);
//         const track = tracks[t];
//         const cover = `cover-0${parseInt(t) + 1}.webp`;
//         const album = await createAlbum(artist.id, cover);
//         await createTrack(user.id, artist.id, album.id, track);
//       }
//     }
//   }
// }

async function seedPlaylists() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    await createUserBasePlaylists(user.id);
  }
}

async function seedRooms() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  for (const user of users) {
    const roomId = generateRoomId();
    const playlistId = generatePlaylistId();
    const name = `Room for ${user.id}`;
    const room = await db.room.create({
      data: {
        id: roomId,
        name,
        owner: { connect: { id: user.id } },
        metadata: { cover: null },
        playlist: {
          create: {
            id: playlistId,
            name: `Playlist for ${user.id}`,
            slug: kebabCase(name),
            type: 'room',
            owner: { connect: { id: user.id } },
            metadata: { cover: null },
          },
        },
      },
    });
    console.log(`Created room ${room.id} for user ${user.id}`);
  }
}

async function main() {
  await cleanup();
  await seedPlaylists();
  await seedRooms();
  console.log('Database seeded successfully!');
  console.log('You can now start the server with `npm run dev`');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
