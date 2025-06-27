import type { WSContext, WSMessageReceive } from 'hono/ws';
import { RoomMemberTracker, roomSchema, RoomsTracker } from '../../domain';
import WebSocket from 'ws';
import { db } from '@/shared/clients/db';
import { parseArrayToSchema } from '@/shared/infra/parse-array-to-schema';

interface RoomSession {
  memberId: string;
  userId: string | null;
}

export class RoomsService {
  private static instance: RoomsService;
  private wsClient = new Map<WSContext<WebSocket>, { session: RoomSession; roomId: string }>();

  private static get tracker() {
    return RoomsTracker.getInstance();
  }

  get tracker() {
    return RoomsService.tracker;
  }

  public static getInstance(): RoomsService {
    if (!RoomsService.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance;
  }

  static async init(): Promise<void> {
    const rooms = parseArrayToSchema(
      await db.room.findMany({
        include: {
          plugins: true,
        },
      }),
      roomSchema,
    );

    rooms.forEach((roomData) => {
      const room = this.tracker.addRoom({
        roomId: roomData.id,
        ownerId: roomData.ownerId,
        name: roomData.name || undefined,
        playlistId: roomData.playlistId || null,
        cover: roomData.metadata?.cover,
      });
      roomData.plugins?.forEach((roomPlugin) => {
        const parsedSettings = room.plugins
          .getPluginRegistry(roomPlugin.pluginId)
          ?.settings.schema.parse(roomPlugin.settings);

        const plugin = room.plugins.addPlugin({
          id: roomPlugin.id,
          name: roomPlugin.pluginId,
          settings: parsedSettings,
          installedAt: roomPlugin.createdAt,
          state: roomPlugin.lastState,
        });
        plugin?.start(); // Automatically start the plugin if it has a start method
      });
    });
  }

  getAllRooms() {
    return this.tracker.getAllRooms();
  }

  getRoom(roomId: string) {
    return this.tracker.getRoom(roomId);
  }

  handleJoin(ws: WSContext<WebSocket>, session: RoomSession, roomId: string) {
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    if (this.wsClient.has(ws)) {
      console.warn(`WebSocket already connected for ${session.userId || 'N/A'} in room ${roomId}`);
      return;
    }

    this.wsClient.set(ws, { session, roomId });

    const send = (event: string) => {
      return (data: any) => {
        console.log(`[WebSocket][>>>]${event}`, data);
        ws.send(JSON.stringify({ event, data }));
      };
    };
    const tunnelEvents = [
      room.events.buildListener('track_changed', send('track_changed')),
      room.events.buildListener('member_joined', send('member_joined')),
      room.events.buildListener('member_left', send('member_left')),
      room.events.buildListener('player_paused', send('player_paused')),
      room.events.buildListener('player_resumed', send('player_resumed')),
      room.events.buildListener('player_seeked', send('player_seeked')),
      room.events.buildListener('plugin_installed', send('plugin_installed')),
      room.events.buildListener('plugin_uninstalled', send('plugin_uninstalled')),
      room.events.buildListener('plugin_started', send('plugin_started')),
      room.events.buildListener('plugin_stopped', send('plugin_stopped')),
      room.events.buildListener('plugin_state_updated', send('plugin_state_updated')),
      room.events.buildListener('plugin_settings_updated', send('plugin_settings_updated')),
    ];

    const member = room.join(
      RoomMemberTracker.create({
        memberId: session.memberId,
        userId: session.userId,
        host: session.userId === room.ownerId,
        trackId: null,
      }),
    );
    member.events.buildListener('member_left', ({ off }) => {
      console.log(`Member ${session.memberId} left room ${roomId}`);
      if (this.wsClient.has(ws)) this.wsClient.delete(ws);
      tunnelEvents.forEach(({ off }) => off());
      off();
    });
  }

  handleMessage(evt: MessageEvent<WSMessageReceive>, ws: WSContext<WebSocket>) {
    const message = JSON.parse(evt.data.toString());
    const client = this.wsClient.get(ws);
    if (!client) {
      console.warn('WebSocket client not found');
      return;
    }

    const { session, roomId } = client;
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    room.events.emit(message.event, {
      memberId: session.memberId,
      ...message.data,
    });
  }

  handleLeave(ws: WSContext<WebSocket>) {
    const client = this.wsClient.get(ws);
    if (!client) {
      console.warn('WebSocket client not found');
      return;
    }

    const { session, roomId } = client;
    const { memberId } = session;
    const room = this.tracker.getRoom(roomId);
    if (!room) {
      console.error(`Room ${roomId} not found`);
      return;
    }

    const member = room.getMember(memberId);
    if (!member) {
      console.warn(`Member ${session.userId} not found in room ${roomId}`);
      return;
    }

    member.leave();
  }
}
