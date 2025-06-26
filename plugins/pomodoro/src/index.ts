import { definePlugin } from '@plugins/core';
import { z } from 'zod';
import PomodoroWidget from './components/pomodoro-widget';
import { PomodoroController } from './controller';

const pomodoroPlugin = definePlugin({
  id: 'pomodoro-plugin',
  state: {
    schema: z.object({
      focusSession: z.number(),
      shortBreak: z.number(),
      longBreak: z.number(),
      longBreakAfter: z.number(),
    }),
    defaultValues: {
      focusSession: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakAfter: 4,
    },
  },
  settings: {
    schema: z.object({
      currentPhase: z.enum(['focus', 'break', 'longBreak', 'idle']),
      timeRemaining: z.number(),
      pomodorosCompleted: z.number(),
    }),
    defaultValues: {
      currentPhase: 'idle',
      timeRemaining: 0,
      pomodorosCompleted: 0,
    },
  },
  components: {
    Widget: PomodoroWidget,
  },
  controller: new PomodoroController(),
});

export { pomodoroPlugin };
