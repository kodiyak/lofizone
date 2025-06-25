export namespace Api {
  export interface Room {
    roomId: string;
    playlistId: string | null;
    name: string;
    ownerId: string;
    plugins: Plugin[];
  }

  export interface Plugin<T = any> {
    id: string;
    ui: { gridWidth: number };
    state: T;
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

  export interface Playlist {
    id: string;
    title: string;
    ownerId: string;
    metadata: {
      cover: string | null;
    };
  }

  export interface CreateRoomRequest {
    name: string;
  }

  export interface CreatePlaylistRequest {
    name: string;
  }

  export interface UploadTrackRequest {
    title: string;
    track: File;
  }
}
