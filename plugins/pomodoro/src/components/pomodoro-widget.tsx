import {
  Card,
  CardContent,
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
import type { PomodoroController } from '../controller';

export default function PomodoroWidget({
  controller,
}: PluginWidgetProps<PomodoroController>) {
  const openSettings = useDisclosure();
  const state = usePluginState();
  const settings = usePluginSettings();

  const { start, stop, reset } = controller;

  return (
    <>
      <PomodoroSettings {...openSettings} />
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Pomodoro</CardTitle>
        </CardHeader>
        <CardContent className="items-center">
          <pre className="text-xs font-mono">
            {JSON.stringify({ state, settings }, null, 2)}
          </pre>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <CircularProgress
                current={20}
                fillColor="var(--primary)"
                size={140}
                total={100}
              />

              <div className="absolute size-full inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">20:00</span>
                <span className="text-xs text-muted-foreground">Remaining</span>
              </div>
            </div>
            <div className="flex justify-center gap-2 items-center px-2 py-1 rounded-xl bg-background/50 backdrop-blur-md border">
              <Button
                variant={'outline'}
                size={'icon-sm'}
                className="rounded-full"
                onClick={() => {
                  stop();
                }}
              >
                <StopIcon weight="fill" />
              </Button>

              <Button
                variant={'outline'}
                size={'icon'}
                className="rounded-full"
                onClick={() => {
                  reset();
                }}
              >
                <PauseIcon />
              </Button>
              <Button
                variant={'outline'}
                size={'icon-sm'}
                className="rounded-full"
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
