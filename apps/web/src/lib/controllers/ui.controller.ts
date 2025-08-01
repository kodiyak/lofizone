import { useUiStore } from '../store/use-ui-store';

export interface UiBackground {
  src?: string;
  style?: React.CSSProperties;
  className?: string;
  imgClassName?: string;
  gradients?: { className?: string }[];
}

export type UiBackgroundState =
  | 'hidden'
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export interface UiTheme {
  title: string;
  description: string;
  cssVars?: Record<string, string>;
  mode: 'light' | 'dark';
  background?: UiBackground;
  backgroundState: UiBackgroundState;
  membersBackground?: UiBackground;
  bottomBarBackground?: UiBackground;
  sidebarBackground?: UiBackground;
}

export class UiController {
  private static instance: UiController;

  private _background?: UiBackground;
  private _backgroundState: UiBackgroundState = 'hidden';

  public get background() {
    return this.store.getState().background;
  }

  public set background(background: UiBackground | undefined) {
    this._background = background;
    this.store.setState(() => ({ background }));
  }

  public get backgroundState() {
    return this.store.getState().backgroundState;
  }

  public set backgroundState(state: UiBackgroundState) {
    this._backgroundState = state;
    this.store.setState(() => ({ backgroundState: state }));
  }

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): UiController {
    if (!UiController.instance) {
      UiController.instance = new UiController();
    }
    return UiController.instance;
  }

  public get store() {
    return {
      getState: useUiStore.getState,
      setState: useUiStore.setState,
    };
  }
}
