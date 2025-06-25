import { MinusIcon, PlusIcon } from '@phosphor-icons/react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import React from 'react';

type LabelValue = (value: number) => [string, string] | string[];
const defaultLabelValue: LabelValue = (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return [minutes.toString(), 'min'];
};

interface PomodoroTimerFieldProps {
  name: string;
  title: string;
  value?: number;
  onChange?: (value: number) => void;
  labelValue?: LabelValue;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function PomodoroTimerField({
  name,
  title,
  labelValue = defaultLabelValue,
  value: valueInput,
  onChange,
  step = 60, // Default step is 60 seconds (1 minute)
  min = 0, // Default minimum is 0 seconds
  max = 3600, // Default maximum is 3600 seconds (60 minutes)
  disabled = false,
}: PomodoroTimerFieldProps) {
  const value = valueInput ?? 25 * 60; // Default to 25 minutes in seconds
  const [label, sufix] = labelValue(value);
  const isAddDisabled = value + step > max;
  const isSubtractDisabled = value - step < min;

  const onAdd = () => {
    if (onChange) {
      const newValue = Math.min(value + step, max);
      onChange(newValue);
    }
  };

  const onSubtract = () => {
    if (onChange) {
      const newValue = Math.max(value - step, min);
      onChange(newValue);
    }
  };

  return (
    <>
      <AccordionItem value={name}>
        <AccordionTrigger>
          <div className="flex-1 flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-end gap-1 text-muted-foreground">
              <span className="text-lg font-bold leading-none">{label}</span>
              <span className="text-xs">{sufix}</span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 py-4">
          <div
            className={cn(
              'flex justify-between items-center gap-2 transition-all',
              disabled ? 'opacity-50 scale-90' : 'opacity-100 scale-100',
            )}
          >
            <Button
              variant={'outline'}
              size={'icon'}
              className="rounded-full"
              disabled={isSubtractDisabled || disabled}
              onClick={() => {
                if (disabled) return;
                onSubtract();
              }}
            >
              <MinusIcon />
            </Button>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold leading-none">{label}</span>
              <span className="text-lg font-medium text-muted-foreground">
                {sufix}
              </span>
            </div>
            <Button
              variant={'outline'}
              size={'icon'}
              disabled={isAddDisabled || disabled}
              className="rounded-full"
              onClick={() => {
                if (disabled) return;
                onAdd();
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
