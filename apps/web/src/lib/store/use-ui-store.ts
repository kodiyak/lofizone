import { create } from 'zustand';
import {
  UiController,
  type UiBackground,
  type UiBackgroundState,
  type UiTheme,
} from '../controllers/ui.controller';
import { themes } from '../themes';

interface UiStore extends UiTheme {
  controller: UiController;
  setBackground: (background: UiBackground) => void;
  setBackgroundState: (state: UiBackgroundState) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  ...themes[0],
  controller: UiController.getInstance(),
  setBackground: (background) => set({ background }),
  setBackgroundState: (state) => set({ backgroundState: state }),
}));
