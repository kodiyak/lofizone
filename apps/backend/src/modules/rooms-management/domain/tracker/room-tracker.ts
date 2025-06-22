import { RoomMemberTracker } from './room-member-tracker';

export interface RoomTrackerProps {
  roomId: string;
  playlistId?: string | null;
  trackId?: string | null;
  name?: string;
  cover?: string | null;
}

export class RoomTracker {
  private readonly members: RoomMemberTracker[] = [];

  constructor(private readonly props: RoomTrackerProps) {}

  get roomId() {
    return this.props.roomId;
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
      throw new Error(`Member with ID ${member.memberId} is already in the room.`);
    }

    this.members.push(member);
    return member;
  }

  public leave(memberId: string) {
    const memberIndex = this.members.findIndex((m) => m.memberId === memberId);
    if (memberIndex === -1) {
      throw new Error(`Member with ID ${memberId} is not in the room.`);
    }

    this.members.splice(memberIndex, 1);
  }

  public getMembers(): RoomMemberTracker[] {
    return this.members;
  }

  toJSON() {
    return {
      roomId: this.roomId,
      playlistId: this.playlistId,
      trackId: this.trackId,
      name: this.name,
      cover: this.cover,
      members: this.members,
    };
  }
}
