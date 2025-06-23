import { EventEmitter } from '@/shared/infra/event-emitter';
import { z } from 'zod';

export interface RoomMemberTrackerProps {
  memberId: string;
  userId: string | null;
  host: boolean;
  trackId?: string | null;
}

const RoomMemberTrackerEvents = z.object({
  track_changed: z.object({
    trackId: z.string().nullable(),
  }),
  member_left: z.object({}),
});

export class RoomMemberTracker {
  public readonly events = new EventEmitter(RoomMemberTrackerEvents, 'RoomMemberTracker');

  constructor(private readonly props: RoomMemberTrackerProps) {}

  get memberId() {
    return this.props.memberId;
  }

  get userId() {
    return this.props.userId;
  }

  get host() {
    return this.props.host;
  }

  get trackId() {
    return this.props.trackId || null;
  }

  static create(props: RoomMemberTrackerProps): RoomMemberTracker {
    return new RoomMemberTracker(props);
  }

  changeTrack(trackId: string) {
    this.props.trackId = trackId;
    this.events.emit('track_changed', {
      trackId: this.trackId,
    });
  }

  leave() {
    this.events.emit('member_left', {});
  }

  public toJSON() {
    return {
      memberId: this.memberId,
      host: this.host,
    };
  }
}
