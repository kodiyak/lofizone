import { definePlugin } from '@plugins/core';
import { z } from 'zod';
import PomodoroWidget from './components/pomodoro-widget';

export default definePlugin({
  id: 'pomodoro-plugin',
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
  components: {
    Widget: PomodoroWidget,
  },
});
