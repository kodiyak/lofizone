import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@workspace/ui/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

const buttonVariants = cva(
  cn(
    'inline-flex font-sans items-center cursor-default justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all',
    'disabled:bg-accent disabled:from-accent disabled:to-accent disabled:opacity-40 disabled:text-muted-foreground/50 disabled:cursor-not-allowed',
    'shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background/50 text-muted-foreground hover:bg-muted/35 hover:text-foreground',
        secondary:
          'border bg-background/50 bg-gradient-to-b from-accent/10 to-background text-muted-foreground hover:text-foreground',
        ghost:
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/30',
        'ghost-purple':
          'text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/40',
        'destructive-ghost':
          'text-muted-foreground hover:bg-accent hover:text-destructive dark:hover:bg-accent/30',
        'success-ghost':
          'text-muted-foreground hover:bg-accent hover:text-success dark:hover:bg-accent/30',
        'success-outline':
          'border border-success/20 bg-background/50 text-success hover:bg-success/10 hover:text-success-foreground',
        link: 'text-muted-foreground underline-offset-4 hover:underline hover:text-foreground',
        command: cn(
          'border-input data-[placeholder]:text-muted-foreground',
          "[&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 ",
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          'dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap',
          'transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center',
          "*:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        ),
      },
      size: {
        default: `h-12 rounded-2xl px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-5`,
        sm: `h-10 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-5`,
        xs: `h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4`,
        xxs: `h-8 text-xs rounded gap-1 p-0 h-auto [&_svg:not([class*='size-'])]:size-3`,
        lg: `h-10 rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4`,
        icon: 'size-9 [&_svg]:size-5',
        'icon-sm': 'size-8 rounded [&_svg]:size-5',
        'icon-xs': 'size-5 rounded [&_svg]:size-3.5',
        'icon-xxs': 'size-4 rounded [&_svg]:size-3',
      },
      rounded: {
        true: 'rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: false,
    },
  },
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      type={'button'}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export interface ButtonsIconsProps {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  items: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    description?: React.ReactNode;
    hidden?: boolean;
  }[];
}
function ButtonsIcons({
  items,
  variant = 'ghost',
  size = 'icon',
}: ButtonsIconsProps) {
  return (
    <>
      {items
        .filter((i) => !i.hidden)
        .map((item, index) => (
          <Tooltip key={index}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={item.variant ?? variant}
                    size={item.size ?? size}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={cn('')}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Tooltip>
        ))}
    </>
  );
}

export { Button, buttonVariants, ButtonsIcons };
