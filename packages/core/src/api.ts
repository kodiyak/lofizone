export namespace Api {
  export interface Room {
    roomId: string;
    name: string;
    ownerId: string;
  }

  export interface RoomMember {
    memberId: string;
    host: boolean;
    muted?: boolean;
  }

  export interface Track {
    id: string;
    title: string;
    albumId: string;
    metadata: {
      audio?: string | null;
      background?: {
        type: 'image' | 'video';
        url: string;
      };
    };
  }
}
