import { create } from 'zustand';
import { RoomController } from '../controllers/room.controller';
import type { Api } from '@workspace/core';

interface PluginState {
  id: string;
  name: string;
  state: any;
  settings: any;
}

interface RoomControllerStore {
  controller: RoomController;
  plugins: PluginState[];
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
  plugins: [],
  tracks: [],
  audioState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },
}));
