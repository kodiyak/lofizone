import { create } from 'zustand';
import { RoomController } from '../rooms/room.controller';
import type { Api } from '@workspace/core';

interface RoomControllerStore {
  controller: RoomController;
  isConnected: boolean;
  track?: Api.Track | null;
  room: Api.Room | null;
  members: Api.RoomMember[];
  audioState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
  tracks: any[];
}

export const useRoomController = create<RoomControllerStore>((set, get) => ({
  isConnected: false,
  trackId: null,
  room: null,
  members: [],
  controller: RoomController.getInstance(),
  tracks: [],
  audioState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },
}));
