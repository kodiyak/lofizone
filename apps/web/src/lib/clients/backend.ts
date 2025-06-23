import type { Api } from '@workspace/core';
import axios from 'axios';

function getToken() {
  return localStorage.getItem('auth_token') || undefined;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  setToken: (token: string) => {
    console.log('Setting token:', token);
    localStorage.setItem('auth_token', token);
    client.defaults.headers.common['Authorization'] = `${token}`;
  },
  getToken,
  client,
};

export { backendClient };
