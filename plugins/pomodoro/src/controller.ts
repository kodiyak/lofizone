import { BasePlugin } from '@plugins/core';
import type { PomodoroPluginSettings, PomodoroPluginState } from './types';

export class PomodoroController extends BasePlugin<
  PomodoroPluginSettings,
  PomodoroPluginState
> {
  protected onInit(): void {
    console.log('PomodoroController initialized', this);
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
  }

  reset() {
    console.log('Pomodoro reset');
  }
}
