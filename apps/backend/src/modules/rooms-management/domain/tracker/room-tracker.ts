import { EventEmitter } from '@/shared/infra/event-emitter';
import { RoomMemberTracker } from './room-member-tracker';
import { MemberNotFoundError } from '../errors';
import type { Plugin } from '@/modules/plugins';
import { RoomTrackerEvents } from '@workspace/core';

export interface RoomTrackerProps {
  roomId: string;
  ownerId: string;
  playlistId?: string | null;
  trackId?: string | null;
  name?: string;
  cover?: string | null;
  plugins?: Plugin[];
}

export class RoomTracker {
  private readonly members: RoomMemberTracker[] = [];
  private readonly tracksIds: string[] = []; // Assuming tracks are stored as an array of track IDs

  public readonly events = new EventEmitter(RoomTrackerEvents, 'RoomTracker');
  private readonly plugins: Plugin[] = [];

  constructor(private readonly props: RoomTrackerProps) {
    this.plugins = props.plugins || [];
  }

  get roomId() {
    return this.props.roomId;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get playlistId() {
    return this.props.playlistId || null;
  }

  get name() {
    return this.props.name || null;
  }

  get cover() {
    return this.props.cover || null;
  }

  public join(member: RoomMemberTracker) {
    if (this.members.some((m) => m.memberId === member.memberId)) {
      console.warn(`Member with ID ${member.memberId} is already in the room.`);
      return this.getMember(member.memberId)!;
    }

    this.members.push(member);
    this.events.emit('member_joined', {
      memberId: member.memberId,
      host: member.host,
    });

    const streamedTrackEvents = [
      member.events.buildListener('track_changed', (data) => {
        this.events.emit('track_changed', {
          memberId: member.memberId,
          trackId: data.trackId,
        });
      }),
      // member.events.buildListener('playlist_changed', (data) => {
      //   this.events.emit('playlist_changed', {
      //     memberId: member.memberId,
      //     playlistId: data.playlistId,
      //   });
      // }),
    ];

    member.events.buildListener('member_left', ({ off: offMemberLeft }) => {
      const memberId = member.memberId;
      const memberIndex = this.members.findIndex((m) => m.memberId === memberId);
      if (memberIndex === -1) {
        throw new MemberNotFoundError(memberId);
      }

      this.members.splice(memberIndex, 1);
      this.events.emit('member_left', { memberId });
      streamedTrackEvents.forEach((e) => e.off());
      offMemberLeft();
    });

    return member;
  }

  public hasMember(memberId: string): boolean {
    return this.members.some((member) => member.memberId === memberId);
  }

  public async startPlugin(plugin: Plugin) {
    if (this.plugins.some((p) => p.id === plugin.id)) {
      console.warn(`Plugin with ID ${plugin.id} is already added to the room.`);
      return;
    }
    this.plugins.push(plugin);
    await plugin.onRoomStarted?.(this);
    this.events.emit('plugin_started', {
      pluginId: plugin.id,
      roomId: this.roomId,
    });

    const pluginEvents = [
      this.events.buildListener('member_joined', (data) => {
        plugin.onMemberJoined?.(this, data.memberId);
      }),
      this.events.buildListener('member_left', (data) => {
        plugin.onMemberLeft?.(this, data.memberId);
      }),
    ];

    this.events.buildListener('plugin_stopped', ({ off: offPluginStopped }) => {
      const pluginIndex = this.plugins.findIndex((p) => p.id === plugin.id);
      if (pluginIndex === -1) {
        console.warn(`Plugin with ID ${plugin.id} is not found in the room.`);
        return;
      }
      this.plugins.splice(pluginIndex, 1);
      offPluginStopped();
      pluginEvents.forEach((e) => e.off());
    });
  }

  public getPlugins(): Plugin[] {
    return this.plugins;
  }

  public async stopPlugin(pluginId: string) {
    const pluginIndex = this.plugins.findIndex((p) => p.id === pluginId);
    if (pluginIndex === -1) {
      console.warn(`Plugin with ID ${pluginId} is not found in the room.`);
      return;
    }
    const plugin = this.plugins[pluginIndex];
    await plugin.onRoomStopped?.(this);
    this.events.emit('plugin_stopped', {
      pluginId,
      roomId: this.roomId,
    });
  }

  public addTracks(tracksIds: string[]) {
    if (tracksIds.length === 0) {
      console.warn('No tracks provided to add.');
      return;
    }

    const addedTracks = tracksIds.filter((id) => !this.tracksIds.includes(id));
    if (addedTracks.length === 0) {
      console.warn('No new tracks to add. Tracks already exist in the room.');
      return;
    }
    addedTracks.forEach((trackId) => {
      this.tracksIds.push(trackId);
      this.events.emit('track_added', {
        memberId: this.ownerId,
        trackId,
      });
    });
  }

  public removeTracks(tracksIds: string[]) {
    if (tracksIds.length === 0) {
      console.warn('No tracks provided to remove.');
      return;
    }

    const removedTracks = tracksIds.filter((id) => this.tracksIds.includes(id));
    if (removedTracks.length === 0) {
      console.warn('No tracks to remove. Tracks do not exist in the room.');
      return;
    }
    removedTracks.forEach((trackId) => {
      const index = this.tracksIds.indexOf(trackId);
      if (index !== -1) {
        this.tracksIds.splice(index, 1);
        this.events.emit('track_removed', {
          memberId: this.ownerId,
          trackId,
        });
      }
    });
  }

  public getMember(memberId: string): RoomMemberTracker | undefined {
    return this.members.find((member) => member.memberId === memberId);
  }

  public getMembers(): RoomMemberTracker[] {
    return this.members;
  }

  toJSON() {
    return {
      roomId: this.roomId,
      ownerId: this.ownerId,
      playlistId: this.playlistId,
      name: this.name,
      cover: this.cover,
      members: this.members,
      plugins: this.plugins.map((plugin) => plugin.toJSON(this.roomId)),
    };
  }
}
