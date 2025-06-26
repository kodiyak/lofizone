import { z } from 'zod';

export const PomodoroPluginSettingsSchema = z.object({
  focusSession: z.number(),
  shortBreak: z.number(),
  longBreak: z.number(),
  longBreakAfter: z.number(),
});
export type PomodoroPluginSettings = z.infer<
  typeof PomodoroPluginSettingsSchema
>;

export const PomodoroPluginStateSchema = z.object({
  currentPhase: z.enum(['focus', 'break', 'longBreak', 'idle']),
  timeRemaining: z.number(),
  pomodorosCompleted: z.number(),
});
export type PomodoroPluginState = z.infer<typeof PomodoroPluginStateSchema>;
