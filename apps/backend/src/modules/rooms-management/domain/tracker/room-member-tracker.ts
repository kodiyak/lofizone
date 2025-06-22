export interface RoomMemberTrackerProps {
  memberId: string;
  host: boolean;
}

export class RoomMemberTracker {
  constructor(private readonly props: RoomMemberTrackerProps) {}

  get memberId(): string {
    return this.props.memberId;
  }

  get host(): boolean {
    return this.props.host;
  }

  static create(props: RoomMemberTrackerProps): RoomMemberTracker {
    return new RoomMemberTracker(props);
  }

  public toJSON() {
    return {
      memberId: this.memberId,
      host: this.host,
    };
  }
}
