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
import { PluginsController } from './plugins.controller';
import { PluginsRegistry } from '@plugins/core';
import { pomodoroPlugin } from '@plugins/pomodoro';
import { EventEmitter } from 'eventemitter3';

type RoomEventHandler<K extends keyof RoomTrackerEventsData> = (
  data: RoomTrackerEventsData[K] & {
    roomId: string;
    memberId: string;
    fromMe: boolean;
  },
) => void | Promise<void>;

type _EnumerateEventHandlers = {
  [K in keyof RoomTrackerEventsData]?: RoomEventHandler<K>;
};

export class RoomController implements _EnumerateEventHandlers {
  private socket?: WebSocket;
  private static instance: RoomController;

  public readonly memberId = generateMemberId();
  public readonly music: MusicStreamController;
  public readonly plugins: PluginsController;
  public readonly events = new EventEmitter();

  set track(track: Api.Track | null) {
    this.store.setState(() => ({ track }));
  }

  get track() {
    return this.state.track || null;
  }

  set isConnected(isConnected: boolean) {
    this.store.setState(() => ({ isConnected }));
    this.ui.backgroundState = isConnected ? 'hidden' : 'loading';
    console.log(`[RoomController] Connection status changed: ${isConnected}`);
  }

  get isConnected() {
    return this.state.isConnected;
  }

  set members(members: Api.RoomMember[]) {
    this.store.setState(() => ({ members }));
  }

  get members() {
    return this.state.members;
  }

  set room(room: Api.Room | null) {
    this.store.setState(() => ({ room }));
  }

  get room() {
    return this.state.room;
  }

  get store() {
    return {
      getState: useRoomController.getState,
      setState: useRoomController.setState,
    };
  }

  get state() {
    return this.store.getState();
  }

  get ui() {
    return UiController.getInstance();
  }

  get backend() {
    return backendClient;
  }

  private constructor() {
    // Private constructor to enforce singleton pattern
    this.music = new MusicStreamController(this);
    this.plugins = new PluginsController(this);
    // Setup Plugins
    PluginsRegistry.getInstance().register(pomodoroPlugin);
  }

  static getInstance(): RoomController {
    if (!RoomController.instance) {
      RoomController.instance = new RoomController();
    }
    console.log(RoomController.instance);
    return RoomController.instance;
  }

  play(trackId: string) {
    this.send('track_changed', { trackId, memberId: this.memberId });
  }

  seek(time: number) {
    this.music.seek(time);
    this.send('player_seeked', { time, memberId: this.memberId });
  }

  pause() {
    this.music.pause();
    this.send('player_paused', { memberId: this.memberId });
  }

  resume() {
    this.music.play();
    this.send('player_resumed', { memberId: this.memberId });
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

    console.log({ room });

    room.plugins.forEach((plugin) => {
      this.plugins.addPlugin(plugin);
    });

    // this.plugins.reset();
    // this.plugins.addPlugins(Object.values(availablePlugins));
    // const plugins = this.getInstalledPlugins().forEach((plugin) => {
    //   const roomPlugin = room?.plugins?.find((p) => p.id === plugin.id);
    //   const api = definePluginAPI({
    //     send: this.send.bind(this),
    //     on: this.on.bind(this),
    //     getCurrentRoom: () => room,
    //     getCurrentMember: () =>
    //       this.members.find((m) => m.memberId === this.memberId)!,
    //     getCurrentTrack: () => this.track,
    //     getCurrentPlugin: () => roomPlugin!,
    //   });
    //   plugin.controller.initialize({
    //     state: roomPlugin?.state,
    //     api,
    //   });
    //   return plugin;
    // });

    const onMessage = (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      const { event: eventName } = payload;
      // @ts-expect-error: Dynamic RoomTrackerEvents
      const data = RoomTrackerEvents.shape[eventName]?.safeParse(payload.data);
      if (!data.success) {
        console.warn('Invalid data received:', { error: data.error, payload });
        return;
      }

      // @ts-expect-error: Dynamic handlers
      const handler = this[eventName]?.bind(this);
      if (!handler) {
        console.warn('No handler for event:', eventName);
        return;
      }
      const handlerData = {
        ...data.data,
        fromMe: data.data.memberId
          ? this.memberId === data.data.memberId
          : false,
      };
      console.log(`[<<<][RoomController][${eventName}]`, handlerData);
      handler(handlerData);
      this.events.emit(eventName, handlerData);
    };
    const onError = (event: Event) => {
      console.error('WebSocket error:', event);
    };
    const onClose = (event: CloseEvent) => {
      this.socket?.removeEventListener('message', onMessage);
      this.socket?.removeEventListener('close', onClose);
      this.socket?.removeEventListener('open', onOpen);
      this.socket?.removeEventListener('error', onError);
      // this.plugins.destroyPlugins();
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

  member_left: RoomEventHandler<'member_left'> = async (data) => {
    const { memberId } = data;
    this.store.setState((state) => ({
      members: state.members.filter((m) => m.memberId !== memberId),
    }));
    console.log(`Member left: ${memberId}`);
  };

  track_changed: RoomEventHandler<'track_changed'> = async (data) => {
    const { memberId, trackId, fromMe } = data;
    if (trackId === null) {
      this.music.stop();
      return;
    }
    await this.music.prepare(trackId);
  };

  player_paused: RoomEventHandler<'player_paused'> = async (data) => {
    const { memberId, fromMe } = data;
    if (!fromMe) {
      this.music.pause();
      console.log(`Player paused by member: ${memberId}`);
    }
  };

  player_resumed: RoomEventHandler<'player_resumed'> = async (data) => {
    const { memberId, fromMe } = data;
    if (!fromMe) {
      this.music.play();
      console.log(`Player resumed by member: ${memberId}`);
    }
  };

  player_seeked: RoomEventHandler<'player_seeked'> = async (data) => {
    const { memberId, time, fromMe } = data;
    if (!fromMe) {
      this.music.seek(time);
      console.log(`Player seeked by member: ${memberId} to ${time}`);
    }
  };

  plugin_started: RoomEventHandler<'plugin_started'> = async (data) => {
    console.log(`Plugin Started`, data);
  };

  plugin_stopped: RoomEventHandler<'plugin_stopped'> = async (data) => {
    console.log(`Plugin Stopped`, data);
  };

  plugin_state_updated: RoomEventHandler<'plugin_state_updated'> = async (
    data,
  ) => {
    /** Syncronize plugin state with the store */
    this.plugins.store.setState((state) => {
      const plugin = state.plugins.find((p) => p.id === data.pluginId);
      if (!plugin) {
        console.warn(`Plugin not found: ${data.pluginId}`);
        return state;
      }
      return {
        plugins: state.plugins.map((p) =>
          p.id === data.pluginId ? { ...p, state: data.state } : p,
        ),
      };
    });
  };

  plugin_settings_updated: RoomEventHandler<'plugin_settings_updated'> = async (
    data,
  ) => {
    /** Syncronize plugin settings with the store */
    this.plugins.store.setState((state) => {
      const plugin = state.plugins.find((p) => p.id === data.pluginId);
      if (!plugin) {
        console.warn(`Plugin not found: ${data.pluginId}`);
        return state;
      }
      return {
        plugins: state.plugins.map((p) =>
          p.id === data.pluginId ? { ...p, settings: data.settings } : p,
        ),
      };
    });
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
      data: {
        ...data,
        roomId: this.store.getState().room?.roomId, // Ensure roomId is included
        memberId: this.memberId, // Include memberId in the data
        timestamp: Date.now(),
      },
    };

    this.socket.send(JSON.stringify(payload));
    console.log(`[>>>][RoomController][${event}]`, payload);
  }

  on<K extends keyof RoomTrackerEventsData>(
    eventName: K,
    handler: RoomEventHandler<K>,
  ) {
    const onHandler = (data: any) => {
      handler(data);
    };
    this.events.on(eventName, onHandler);

    const off = () => {
      this.events.off(eventName, onHandler);
      console.log(`Removed handler for event: ${eventName}`);
    };

    return off;
  }
}
