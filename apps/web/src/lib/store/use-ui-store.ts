import { create } from 'zustand';
import {
  UiController,
  type UiBackground,
  type UiBackgroundState,
  type UiTheme,
} from '../controllers/ui.controller';
import { themes } from '../themes';

interface UiStore extends UiTheme {
  setBackground: (background: UiBackground) => void;
  setBackgroundState: (state: UiBackgroundState) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  controller: UiController.getInstance(),
  backgroundState: 'hidden',
  mode: 'dark',
  background: themes[0].background,
  membersBackground: themes[0].membersBackground,
  setBackground: (background) => set({ background }),
  setBackgroundState: (state) => set({ backgroundState: state }),
}));
