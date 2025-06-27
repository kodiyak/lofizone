import { definePlugin } from '@plugins/core';
import { PomodoroController } from './controller';
import {
  PomodoroPluginSettingsSchema,
  PomodoroPluginStateSchema,
} from './types';
import { lazy } from 'react';

const pomodoroPlugin = definePlugin({
  name: 'pomodoro-plugin',
  title: 'Pomodoro Timer',
  description: 'A Pomodoro timer to help you manage your focus sessions.',
  buildController: () => new PomodoroController(),
  state: {
    schema: PomodoroPluginStateSchema,
    defaultValues: {
      currentPhase: 'idle',
      timeRemaining: 0,
      pomodorosCompleted: 0,
    },
  },
  settings: {
    schema: PomodoroPluginSettingsSchema,
    defaultValues: {
      focusSession: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakAfter: 4,
    },
  },
  components: {
    Widget: lazy(() => import('./components/pomodoro-widget')),
    Icon: lazy(() => import('./components/pomodoro-icon')),
  },
});

export { pomodoroPlugin };
