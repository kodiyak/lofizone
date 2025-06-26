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
      roomData.plugins?.forEach((plugin) => {
        const parsedSettings = room.plugins
          .getPluginRegistry(plugin.pluginId)
          ?.settings.schema.parse(plugin.settings);

        room.plugins.addPlugin({
          id: plugin.id,
          name: plugin.pluginId,
          settings: parsedSettings,
          installedAt: plugin.createdAt,
        });
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
    const pipes = [
      room.events.buildListener('track_changed', send('track_changed')),
      room.events.buildListener('member_joined', send('member_joined')),
      room.events.buildListener('member_left', send('member_left')),
      room.events.buildListener('player_paused', send('player_paused')),
      room.events.buildListener('player_resumed', send('player_resumed')),
      room.events.buildListener('player_seeked', send('player_seeked')),
    ];

    const member = room.join(
      RoomMemberTracker.create({
        memberId: session.memberId,
        userId: session.userId,
        host: session.userId === room.ownerId,
        trackId: null,
      }),
    );
    member.events.buildListener('member_left', ({ off: offMemberLeft }) => {
      console.log(`Member ${session.memberId} left room ${roomId}`);
      if (this.wsClient.has(ws)) this.wsClient.delete(ws);
      pipes.forEach((pipe) => pipe.off());
      offMemberLeft();
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
