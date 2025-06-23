import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@workspace/ui/lib/utils';

const buttonVariants = cva(
  cn(
    'inline-flex font-sans items-center cursor-default justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all',
    'disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'bg-gradient-to-r from-primary to-secondary text-white',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/30',
        'ghost-purple':
          'text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/40',
        'ghost-destructive':
          'text-muted-foreground hover:bg-accent hover:text-destructive dark:hover:bg-accent/30',
        'ghost-success':
          'text-muted-foreground hover:bg-accent hover:text-green-500 dark:hover:bg-accent/30', // TODO: add success variant
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
        default: `h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-5`,
        sm: `h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4`,
        xs: `h-6 text-sm rounded-md gap-1.5 px-3.5 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4`,
        xxs: `h-8 text-xs rounded gap-1 p-0 h-auto [&_svg:not([class*='size-'])]:size-3`,
        lg: `h-10 rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4`,
        icon: 'size-9 [&_svg]:size-5',
        'icon-xs': 'size-5 rounded [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
