export namespace Api {
  export interface Room {
    roomId: string;
    name: string;
    ownerId: string;
  }

  export interface RoomMember {
    memberId: string;
    host: boolean;
    role: 'admin' | 'member';
  }
}
