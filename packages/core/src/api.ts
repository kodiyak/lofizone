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

  export interface Track {
    id: string;
    title: string;
    albumId: string;
    metadata: any;
  }
}
