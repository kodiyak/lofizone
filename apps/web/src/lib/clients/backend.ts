import type { Api } from '@workspace/core';
import axios, { toFormData } from 'axios';
import { z } from 'zod';

function getToken() {
  return localStorage.getItem('auth_token') || undefined;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const validations = {
  createRoom: z.object({
    name: z.string().min(1, 'Room name is required'),
  }),
  createPlaylist: z.object({
    name: z.string().min(1, 'Playlist name is required'),
  }),
  uploadTrack: z.object({
    title: z.string().min(1, 'Track title is required'),
    track: z.instanceof(File).refine((file) => file.size > 0, {
      message: 'Track file is required',
    }),
    cover: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size > 0, {
        message: 'Cover image must be a valid file or empty',
      }),
  }),
  updateRoom: z.object({
    playlistId: z.string().nullable(),
    name: z.string().nullish(),
  }),
};

const backendClient = {
  getRoom: async (roomId: string) =>
    client.get<Api.Room>(`/rooms/${roomId}`).then((r) => r.data),
  getRoomWsUrl: (roomId: string) => {
    const url = new URL(
      `/rooms/${roomId}/ws`,
      process.env.NEXT_PUBLIC_BACKEND_API_URL,
    );

    return url
      .toString()
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
  },
  getRoomMembers: async (roomId: string) =>
    client
      .get<Api.RoomMember[]>(`/rooms/${roomId}/members`)
      .then((r) => r.data),
  getRoomTracks: async (roomId: string) =>
    client.get<Api.Track[]>(`/rooms/${roomId}/tracks`).then((r) => r.data),
  createRoom: async (data: Api.CreateRoomRequest) => {
    return client.post<Api.Room>('/rooms', data).then((r) => r.data);
  },
  createPlaylist: async (data: Api.CreatePlaylistRequest) => {
    return client.post<Api.Playlist>('/playlists', data).then((r) => r.data);
  },
  getPlaylists: async () => {
    return client.get<Api.Playlist[]>('/playlists').then((r) => r.data);
  },
  uploadTrack: async (data: Api.UploadTrackRequest) => {
    return client
      .post<Api.Track>('/tracks', toFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  updateRoom: async (
    roomId: string,
    data: Partial<{
      playlistId: string | null;
      name: string;
    }>,
  ) => {
    return client.put<Api.Room>(`/rooms/${roomId}`, data).then((r) => r.data);
  },
  setToken: (token: string) => {
    console.log('Setting token:', token);
    localStorage.setItem('auth_token', token);
    client.defaults.headers.common['Authorization'] = `${token}`;
  },
  getToken,
  client,
  validations,
};

export { backendClient };
