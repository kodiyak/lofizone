import { BasePlugin } from '@plugins/core';
import type { PomodoroPluginSettings, PomodoroPluginState } from './types';

export class PomodoroController extends BasePlugin<
  PomodoroPluginSettings,
  PomodoroPluginState
> {
  private timer: NodeJS.Timeout = setTimeout(() => {}, 0);
  protected onInit(): void {
    this.setState(
      () => ({
        currentPhase: 'idle',
        isRunning: false,
        pomodorosCompleted: 0,
        timeRemaining: 0,
      }),
      false,
    );
  }
  protected onDestroy(): void {
    console.log('PomodoroController destroyed');
  }

  protected onStateUpdate(state: PomodoroPluginState): void {
    // console.log('State updated:', { isHost: this.api.isHost(), state });
  }

  start() {
    console.log('Pomodoro started');

    this.setState((state) => ({
      ...state,
      isRunning: true,
      currentPhase: 'focus',
      timeRemaining: this.getSettings().focusSession * 60,
    }));

    if (this.api.isHost()) {
      this.timer = setInterval(() => {
        this.setState((state) => {
          if (state.timeRemaining <= 0) {
            clearInterval(this.timer);
            return {
              ...state,
              isRunning: false,
              currentPhase: 'idle',
              timeRemaining: 0,
            };
          }
          return {
            ...state,
            timeRemaining: state.timeRemaining - 1,
          };
        });
      }, 1000);
    }
  }

  stop() {
    console.log('Pomodoro stopped');

    this.setState((state) => ({
      ...state,
      currentPhase: 'idle',
      pomodorosCompleted: this.getState().pomodorosCompleted + 1,
      isRunning: false,
      timeRemaining: 0,
    }));

    if (this.api.isHost()) {
      clearInterval(this.timer);
    }
  }

  reset() {
    console.log('Pomodoro reset');
  }
}
