import { BasePlugin } from '@plugins/core';
import type { PomodoroPluginSettings, PomodoroPluginState } from './types';

export class PomodoroController extends BasePlugin<
  PomodoroPluginSettings,
  PomodoroPluginState
> {
  protected onInit(): void {
    this.setState(() => ({
      currentPhase: 'idle',
      isRunning: false,
      pomodorosCompleted: 0,
      timeRemaining: 0,
    }));
  }
  protected onDestroy(): void {
    console.log('PomodoroController destroyed');
  }

  protected onStateUpdate(state: PomodoroPluginState): void {
    console.log('State updated:', { isHost: this.api.isHost(), state });
  }

  start() {
    console.log('Pomodoro started');

    this.setState((state) => ({
      ...state,
      isRunning: true,
    }));
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
  }

  reset() {
    console.log('Pomodoro reset');
  }
}
