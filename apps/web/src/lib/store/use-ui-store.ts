import { create } from 'zustand';
import Wallpaper from '@/assets/images/wallpaper.png';
import {
  UiController,
  type UiBackground,
  type UiBackgroundState,
} from '../controllers/ui.controller';

interface UiStore {
  background?: UiBackground;
  backgroundState: UiBackgroundState;
  setBackground: (background: UiBackground) => void;
  setBackgroundState: (state: UiBackgroundState) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  controller: UiController.getInstance(),
  background: {
    src: Wallpaper.src,
    className: 'absolute -z-10 w-[30vw] right-0 bottom-0',
    // className:
    //   'absolute -z-10 w-[50vw] right-0 top-0 -translate-y-1/5 translate-x-1/2',
    gradients: [
      { className: 'bg-gradient-to-b from-transparent to-background' },
      {
        className:
          'bg-background bg-gradient-to-l from-transparent via-background/30 to-background',
      },
      {
        className:
          'bg-background bg-gradient-to-t from-transparent via-background/80 to-background',
      },
      // { className: 'bg-gradient-to-r from-transparent to-background' },
    ],
  },
  backgroundState: 'hidden',
  setBackground: (background) => set({ background }),
  setBackgroundState: (state) => set({ backgroundState: state }),
}));
