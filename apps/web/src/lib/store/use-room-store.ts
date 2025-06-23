import type { Api } from '@workspace/core';
import { create } from 'zustand';
import { backendClient } from '../clients/backend';

interface RoomStore {
  isConnected: boolean;
  room: Api.Room | null;
  members: Api.RoomMember[];
  tracks: Api.Track[];
  socket: WebSocket | null;
  connect: (roomId: string) => Promise<void>;
  track: Api.Track | null;
  playTrack: (track: Api.Track) => Promise<void>;
  updatePlaylist: (playlistId: string) => void;
  resume: () => void;
  seek: (time: number) => void;
  pause: () => void;

  // Audio
  audio: HTMLAudioElement | null;
  audioState: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  isConnected: false,
  room: null,
  socket: null,
  track: null,
  audio: null,
  members: [],
  tracks: [],
  audioState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },
  playTrack: async (track) => {
    const { audio: currentAudio } = get();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    if (!track.metadata.audio) {
      console.warn('Track does not have audio metadata:', track);
      return;
    }
    const audio = new Audio(track.metadata.audio);
    set((prev) => ({ audioState: { ...prev.audioState, isPlaying: false } }));

    audio.addEventListener('play', () => {
      set((prev) => ({ audioState: { ...prev.audioState, isPlaying: true } }));
    });

    audio.addEventListener('pause', () => {
      set((prev) => ({ audioState: { ...prev.audioState, isPlaying: false } }));
    });

    audio.addEventListener('timeupdate', () => {
      set((prev) => ({
        audioState: { ...prev.audioState, currentTime: audio.currentTime },
      }));
    });

    audio.addEventListener('loadedmetadata', () => {
      set((prev) => ({
        audioState: { ...prev.audioState, duration: audio.duration },
      }));
    });

    audio.addEventListener('ended', () => {
      set((prev) => ({
        audioState: { ...prev.audioState, isPlaying: false, currentTime: 0 },
      }));
    });

    audio.play();

    set({ audio, track });
  },
  resume: () => {
    const { audio } = get();
    audio?.play();
  },
  pause: () => {
    const { audio } = get();
    audio?.pause();
  },
  seek: (time: number) => {
    const { audio } = get();
    if (audio) audio.currentTime = time;
  },
  updatePlaylist: async (playlistId: string) => {
    const { room } = get();
    if (!room) return;
    await backendClient.updateRoom(room.roomId, {
      playlistId,
    });
    set({ room: { ...room, playlistId } });
  },
  connect: async (roomId: string) => {
    const { socket: currentSocket } = get();
    if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
      currentSocket.close();
      set({ socket: null });
    }

    await Promise.all([
      backendClient.getRoom(roomId).then((room) => set({ room })),
      backendClient.getRoomMembers(roomId).then((members) => set({ members })),
      backendClient.getRoomTracks(roomId).then((tracks) => set({ tracks })),
    ]);
    const socket = new WebSocket(backendClient.getRoomWsUrl(roomId));

    function onOpen(event: Event) {
      socket.addEventListener('message', onMessage);
      socket.addEventListener('close', onClose);
    }
    function onMessage(event: MessageEvent) {
      try {
        const payload = JSON.parse(event.data);
        const handlers = {
          member_joined: (data: Api.RoomMember) => {
            set((state) => ({
              members: [...state.members, data],
            }));
          },
          member_left: (data: Api.RoomMember) => {
            set((state) => ({
              members: state.members.filter(
                (m) => m.memberId !== data.memberId,
              ),
            }));
          },
        };
        const handler = (handlers as any)[payload.event];
        if (!handler) {
          console.warn('No handler for message type:', payload.event);
          return;
        }
        handler(payload.data);
        console.log(payload);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
    function onClose() {
      console.log('WebSocket connection closed');
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
      socket.removeEventListener('error', onError);
      socket.removeEventListener('open', onOpen);
      set({ isConnected: false });
    }
    function onError(error: Event) {
      console.error(
        'WebSocket error:',
        error,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }

    socket.addEventListener('open', onOpen);
    socket.addEventListener('error', onError);

    set({ socket, isConnected: true });
  },
}));
