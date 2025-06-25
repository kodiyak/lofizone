import type { RoomController } from './room.controller';

export class MusicStreamController {
  private audio: HTMLAudioElement | null = null;

  constructor(private readonly room: RoomController) {}

  async prepare(trackId: string) {
    const track = await this.room.backend.getTrack(trackId);
    this.room.track = track;
    if (!track.metadata.audio) {
      throw new Error('Track does not have audio metadata');
    }

    if (track.metadata.background?.url) {
      this.room.ui.background = {
        ...this.room.ui.background,
        src: track.metadata.background.url,
      };
    }

    if (this.audio) {
      this.stop();
      console.warn(
        'Audio already prepared, stopping previous audio before preparing new one',
      );
    }

    const audio = new Audio(track.metadata.audio);

    audio.addEventListener('play', () => {
      this.room.store.setState((state) => ({
        audioState: { ...state.audioState, isPlaying: true },
      }));
    });
    audio.addEventListener('pause', () => {
      this.room.store.setState((state) => ({
        audioState: { ...state.audioState, isPlaying: false },
      }));
    });
    audio.addEventListener('timeupdate', () => {
      this.room.store.setState((state) => ({
        audioState: {
          ...state.audioState,
          currentTime: audio.currentTime,
        },
      }));
    });
    audio.addEventListener('loadedmetadata', async () => {
      this.room.store.setState((state) => ({
        audioState: { ...state.audioState, duration: audio.duration },
      }));

      await audio.play();
    });
    audio.addEventListener('ended', () => {
      this.room.store.setState((state) => ({
        audioState: { ...state.audioState, isPlaying: false, currentTime: 0 },
      }));
    });
    this.audio = audio;
  }

  async play(currentTime?: number) {
    /** @todo: Implement play functionality */
    console.log(`Playing music stream`);
    if (currentTime !== undefined && this.audio) {
      this.audio.currentTime = currentTime;
    }
    await this.audio?.play();
  }

  pause() {
    /** @todo: Implement pause functionality */
    console.log('Pausing music stream');
    this.audio?.pause();
  }

  seek(time: number) {
    /** @todo: Implement seek functionality */
    if (this.audio) {
      this.audio.currentTime = time;
    } else {
      console.warn('Audio is not prepared yet');
    }
  }

  stop() {
    this.audio?.pause();
    this.audio = null;
    console.log('Music stream stopped');
  }
}
