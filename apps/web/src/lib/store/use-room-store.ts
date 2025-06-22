import type { Api } from '@workspace/core';
import { create } from 'zustand';

interface RoomStore {
  room?: Api.Room;
  socket: WebSocket | null;
  connect: (roomId: string) => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  room: undefined,
  socket: null,
  connect: async (roomId: string) => {
    const { socket: currentSocket } = get();
    if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
      currentSocket.close();
      set({ socket: null });
    }

    const socket = new WebSocket(
      `ws://localhost:3000/rooms/${roomId}/ws`,
      'ws',
    );

    function onOpen(event: Event) {
      socket.addEventListener('message', onMessage);
      socket.addEventListener('close', onClose);
    }
    function onMessage(event: MessageEvent) {
      try {
        console.log(event);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
      set({ socket });
    }
    function onClose() {
      console.log('WebSocket connection closed');
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
      socket.removeEventListener('error', onError);
      socket.removeEventListener('open', onOpen);
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

    set({ socket });
  },
}));
