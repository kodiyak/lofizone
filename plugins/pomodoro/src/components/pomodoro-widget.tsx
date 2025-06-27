import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { CircularProgress } from '@workspace/ui/components/progress';
import { Button } from '@workspace/ui/components/button';
import { PauseIcon, StopIcon } from '@phosphor-icons/react';
import { CogIcon } from 'lucide-react';
import PomodoroSettings from './pomodoro-settings';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import {
  usePluginSettings,
  usePluginState,
  type PluginWidgetProps,
} from '@plugins/core';
import { PomodoroController } from '../controller';
import { useMemo } from 'react';

export default function PomodoroWidget({
  controller,
}: PluginWidgetProps<PomodoroController>) {
  const openSettings = useDisclosure();
  const state = usePluginState<PomodoroController>();
  const settings = usePluginSettings<PomodoroController>();

  const display = useMemo(() => {
    if (!settings || !state) {
      return {
        value: 0,
        isLoading: true,
        label: 'Loading',
        description: 'Loading...',
      };
    }

    if (state.currentPhase === 'idle') {
      return {
        value: 0,
        isLoading: true,
        label: 'Start',
        description: 'Stopped',
      };
    }

    if (state?.currentPhase === 'focus') {
      const minutesRemaining = Math.ceil(state.timeRemaining / 60)
        .toString()
        .padStart(2, '0');
      const secondsRemaining = (state.timeRemaining % 60)
        .toString()
        .padStart(2, '0');
      return {
        value: (state.timeRemaining / (settings.focusSession * 60)) * 100,
        isLoading: false,
        label: `${minutesRemaining}:${secondsRemaining}`,
        description: 'Focus',
      };
    }

    return {
      value: 0,
      isLoading: true,
      label: 'Loading',
      description: 'Loading...',
    };
  }, [state, settings]);
  const { description, isLoading, label, value } = display;

  return (
    <>
      <PomodoroSettings {...openSettings} />
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Pomodoro</CardTitle>
        </CardHeader>
        <CardContent className="items-center">
          {/* <pre className="text-xs font-mono">
            {JSON.stringify({ state, settings, display }, null, 2)}
          </pre> */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <CircularProgress
                current={value}
                fillColor="var(--primary)"
                size={140}
                total={100}
              />

              <div className="absolute size-full inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-2 items-center px-2 py-1 rounded-xl bg-background/50 backdrop-blur-md border">
              <Button
                variant={'outline'}
                size={'icon-sm'}
                className="rounded-full"
                disabled={!state?.isRunning || !controller.api.isHost()}
                onClick={() => {
                  controller.stop();
                }}
              >
                <StopIcon weight="fill" />
              </Button>

              <Button
                variant={'outline'}
                size={'icon'}
                className="rounded-full"
                disabled={state?.isRunning || !controller.api.isHost()}
                onClick={() => {
                  controller.start();
                }}
              >
                <PauseIcon />
              </Button>
              <Button
                variant={'outline'}
                size={'icon-sm'}
                className="rounded-full"
                disabled={!controller.api.isHost()}
                onClick={openSettings.onOpen}
              >
                <CogIcon className="size-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
