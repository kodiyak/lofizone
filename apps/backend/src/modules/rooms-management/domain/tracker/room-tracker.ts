import { EventEmitter } from '@/shared/infra/event-emitter';
import { RoomMemberTracker } from './room-member-tracker';
import { z } from 'zod';
import { MemberNotFoundError } from '../errors';

export interface RoomTrackerProps {
  roomId: string;
  ownerId: string;
  playlistId?: string | null;
  trackId?: string | null;
  name?: string;
  cover?: string | null;
}

const RoomTrackerEvents = z.object({
  member_joined: z.object({
    memberId: z.string(),
    host: z.boolean(),
  }),
  member_left: z.object({
    memberId: z.string(),
  }),
  track_changed: z.object({
    memberId: z.string(),
    trackId: z.string().nullable(),
  }),
});

export class RoomTracker {
  private readonly members: RoomMemberTracker[] = [];
  public readonly events = new EventEmitter(RoomTrackerEvents, 'RoomTracker');

  constructor(private readonly props: RoomTrackerProps) {}

  get roomId() {
    return this.props.roomId;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get playlistId() {
    return this.props.playlistId || null;
  }

  get trackId() {
    return this.props.trackId || null;
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
      trackId: this.trackId,
      name: this.name,
      cover: this.cover,
      members: this.members,
    };
  }
}
