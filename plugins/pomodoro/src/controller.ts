import { BasePlugin } from '@plugins/core';
import type { PomodoroPluginSettings, PomodoroPluginState } from './types';

export class PomodoroController extends BasePlugin<
  PomodoroPluginSettings,
  PomodoroPluginState
> {
  protected onInit(): void {
    console.log('PomodoroController initialized', this);
    this.setState((state) => ({
      currentPhase: 'idle',
      pomodorosCompleted: 0,
      timeRemaining: 0,
    }));
  }
  protected onDestroy(): void {
    console.log('PomodoroController destroyed');
  }
  protected onStateUpdate(state: any): void {
    console.log('State updated:', state);
  }

  start() {
    console.log('Pomodoro started');
  }

  stop() {
    console.log('Pomodoro stopped');

    this.setState((state) => ({
      ...state,
      currentPhase: 'idle',
      pomodorosCompleted: this.getState().pomodorosCompleted + 1,
    }));
  }

  reset() {
    console.log('Pomodoro reset');
  }
}
