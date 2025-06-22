import type { Api } from '@workspace/core';

export const backendClient = {
  getRoom: async (roomId: string) =>
    fetch(`/api/server/rooms/${roomId}`).then(
      (res) => res.json() as Promise<Api.Room>,
    ),
  getRoomWsUrl: (roomId: string) => {
    const url = new URL(
      `/rooms/${roomId}/ws`,
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    );

    return url
      .toString()
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');
  },
  getRoomMembers: async (roomId: string) =>
    fetch(`/api/server/rooms/${roomId}/members`).then(
      (res) => res.json() as Promise<Api.RoomMember[]>,
    ),
  getRoomTracks: async (roomId: string) =>
    fetch(`/api/server/rooms/${roomId}/tracks`).then(
      (res) => res.json() as Promise<Api.Track[]>,
    ),
};
