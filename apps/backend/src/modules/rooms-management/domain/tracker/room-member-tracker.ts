import { EventEmitter } from '@/shared/infra/event-emitter';
import { RoomMemberTrackerEvents } from '@workspace/core';

export interface RoomMemberTrackerProps {
  memberId: string;
  userId: string | null;
  host: boolean;
  trackId?: string | null;
}

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
