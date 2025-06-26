import { BasePlugin } from '@plugins/core/src/base-plugin';

export class PomodoroController extends BasePlugin {
  protected onInit(): void {
    console.log('PomodoroController initialized', this);
  }
  protected onDestroy(): void {
    console.log('PomodoroController destroyed');
  }
  protected onStateUpdate(state: any): void {
    console.log('State updated:', state);
  }
}
