import {
  generateMemberId,
  RoomTrackerEvents,
  type Api,
  type RoomTrackerEventsData,
} from '@workspace/core';
import { backendClient } from '../clients/backend';
import { MusicStreamController } from './music-stream.controller';
import { useRoomController } from '../store/use-room-controller';
import { UiController } from './ui.controller';

type RoomEventHandler<K extends keyof RoomTrackerEventsData> = (
  data: RoomTrackerEventsData[K] & { roomId: string },
) => void | Promise<void>;

type RoomEventHandlers = {
  [K in keyof RoomTrackerEventsData]?: RoomEventHandler<K>;
};

export class RoomController implements RoomEventHandlers {
  private socket?: WebSocket;
  private static instance: RoomController;

  public readonly music: MusicStreamController;

  private _members: Api.RoomMember[] = [];
  private _room: Api.Room | null = null;
  private _track: Api.Track | null = null;
  private _isConnected = false;
  private memberId = generateMemberId();

  set track(track: Api.Track | null) {
    this._track = track;
    this.store.setState(() => ({ track }));
  }

  get track() {
    return this._track;
  }

  set isConnected(isConnected: boolean) {
    this._isConnected = isConnected;
    this.store.setState(() => ({ isConnected }));
    this.ui.backgroundState = isConnected ? 'success' : 'loading';
    console.log(`[RoomController] Connection status changed: ${isConnected}`);
  }

  get isConnected() {
    return this._isConnected;
  }

  set members(members: Api.RoomMember[]) {
    this._members = members;
    this.store.setState(() => ({ members }));
  }

  get members() {
    return this._members;
  }

  set room(room: Api.Room | null) {
    this._room = room;
    this.store.setState(() => ({ room }));
  }

  get room() {
    return this._room;
  }

  get store() {
    return {
      getState: useRoomController.getState,
      setState: useRoomController.setState,
    };
  }

  private get ui() {
    return UiController.getInstance();
  }

  get backend() {
    return backendClient;
  }

  private constructor() {
    // Private constructor to enforce singleton pattern
    this.music = new MusicStreamController(this);
  }

  static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }
    console.log(RoomController.instance);
    return RoomController.instance;
  }

  async play(trackId: string) {
    await this.send('track_changed', { trackId, memberId: this.memberId });
  }

  async connect(roomId: string) {
    if (this.socket) {
      console.warn('Already connected to a room. Disconnecting first.');
      this.socket.close();
    }

    this.isConnected = false;
    const [room, members] = await Promise.all([
      await this.backend.getRoom(roomId),
      await this.backend.getRoomMembers(roomId),
    ]);
    this.room = room;
    this.members = members;
    this.socket = new WebSocket(
      backendClient.getRoomWsUrl(roomId, this.memberId),
    );

    console.log('Passaired');

    const onMessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      const { event: eventName } = payload;
      // @ts-expect-error: Dynamic RoomTrackerEvents
      const data = RoomTrackerEvents.shape[eventName]?.safeParse(payload.data);

      console.log(`[<<<][Controller][${eventName}]`, {
        data,
      });
      if (!data.success) {
        console.warn('Invalid data received:', data.error);
        return;
      }

      // @ts-expect-error: Dynamic handlers
      const handler = this[eventName]?.bind(this);
      if (!handler) {
        console.warn('No handler for event:', eventName);
        return;
      }
      handler({ ...data.data, roomId });
    };
    const onError = (event: Event) => {
      console.error('WebSocket error:', event);
    };
    const onClose = (event: CloseEvent) => {
      this.socket?.removeEventListener('message', onMessage);
      this.socket?.removeEventListener('close', onClose);
      this.socket?.removeEventListener('open', onOpen);
      this.socket?.removeEventListener('error', onError);
      this.socket = undefined;
    };
    const onOpen = () => {
      this.socket?.addEventListener('message', onMessage);
      this.isConnected = true;
    };

    this.socket?.addEventListener('open', onOpen);
    this.socket?.addEventListener('error', onError);
    this.socket?.addEventListener('close', onClose);
  }

  member_joined: RoomEventHandler<'member_joined'> = async (data) => {
    const { host, memberId } = data;
    this.store.setState((state) => ({
      members: [...state.members, { host, memberId }],
    }));
  };

  track_changed: RoomEventHandler<'track_changed'> = async (data) => {
    const { memberId, trackId } = data;
    if (trackId === null) {
      this.music.stop();
      return;
    }
    await this.music.prepare(trackId);
  };

  send<K extends keyof RoomTrackerEventsData>(
    event: K,
    data: RoomTrackerEventsData[K],
  ): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not open. Cannot send message:', event);
      return;
    }

    const payload = {
      event,
      data: { ...data, roomId: this.store.getState().room?.roomId },
    };

    this.socket.send(JSON.stringify(payload));
    console.log(`[>>>][Controller][${event}]`, payload);
  }
}
