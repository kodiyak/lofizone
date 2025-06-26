import { Accordion } from '@workspace/ui/components/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import React from 'react';
import PomodoroTimerField from './pomodoro-timer-field';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@workspace/ui/components/form';
import { Button } from '@workspace/ui/components/button';

interface PomodoroSettingsProps extends UseDisclosure {
  onError?: (error: any) => void;
}

export default function PomodoroSettings({
  isOpen,
  onOpenChange,
  onError,
}: PomodoroSettingsProps) {
  const form = useForm({
    defaultValues: {
      focusSession: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakAfter: 4,
    },
  });
  const { isSubmitting, isValid, isDirty } = form.formState;
  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
  };

  return (
    <>
      <Form {...form}>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Pomodoro Settings</DialogTitle>
              <DialogDescription className="pr-12">
                Configure your Pomodoro settings to enhance your productivity.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="flex flex-col gap-4"
            >
              <Accordion
                type="single"
                collapsible
                defaultValue={'focusSession'}
              >
                <FormField
                  name={'focusSession'}
                  render={({ field }) => (
                    <PomodoroTimerField title="Focus Session" {...field} />
                  )}
                />
                <FormField
                  name={'shortBreak'}
                  render={({ field }) => (
                    <PomodoroTimerField title="Short Break" {...field} />
                  )}
                />
                <FormField
                  name={'longBreak'}
                  render={({ field }) => (
                    <PomodoroTimerField title="Long Break" {...field} />
                  )}
                />
                <FormField
                  name={'longBreakAfter'}
                  render={({ field }) => (
                    <PomodoroTimerField
                      title="Long Break After"
                      labelValue={(v) => {
                        return [v.toString(), 'Sess.'];
                      }}
                      {...field}
                    />
                  )}
                />
              </Accordion>
              <DialogFooter>
                <Button
                  type={'submit'}
                  disabled={isSubmitting || !isValid || !isDirty}
                >
                  Save Settings
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
