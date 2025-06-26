import { PluginProvider, type Plugin } from '@plugins/core';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@workspace/ui/components/card';
import React from 'react';
import type { RoomInstallPluginProps } from '../types';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import RoomInstallPluginModal from './room-install-plugin-modal';
import { CheckIcon, PlusIcon } from '@phosphor-icons/react';
import { TrashIcon } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import RoomUninstallPluginModal from './room-uninstall-plugin-modal';

export default function RoomInstallPluginCard(props: RoomInstallPluginProps) {
  const { plugin, isInstalled } = props;
  const install = useDisclosure();
  const mouseEnter = useDisclosure();
  const isHighlighted = mouseEnter.isOpen || install.isOpen;
  const variant = {
    installed: {
      label: isHighlighted ? 'Uninstall' : 'Already Installed',
      icon: isHighlighted ? <TrashIcon /> : <CheckIcon />,
      variant: isHighlighted
        ? ('destructive-ghost' as const)
        : ('success-ghost' as const),
      className: cn(
        !isHighlighted ? 'text-success opacity-50' : 'text-destructive',
      ),
    },
    notInstalled: {
      label: 'Install Now',
      icon: <PlusIcon />,
      variant: 'outline' as const,
    },
  }[isInstalled ? 'installed' : 'notInstalled'];

  return (
    <>
      {isInstalled ? (
        <RoomUninstallPluginModal {...install} {...props} />
      ) : (
        <RoomInstallPluginModal {...install} {...props} />
      )}
      <Card key={plugin.name}>
        <div className="flex items-start gap-4 px-6">
          <div className="size-12 rounded-xl border bg-background bg-gradient-to-br from-card/70 to-background flex items-center justify-center">
            <PluginProvider
              name={plugin.name}
              componentName={'Icon'}
              className={'size-8'}
            />
          </div>
          <CardHeader className="px-0 flex-1">
            <CardTitle>{plugin.title}</CardTitle>
            <CardDescription>{plugin.description}</CardDescription>
          </CardHeader>
        </div>
        <CardFooter>
          <Button
            className={cn('w-full', variant.className)}
            size={'sm'}
            variant={variant.variant}
            onClick={install.onOpen}
            onMouseEnter={mouseEnter.onOpen}
            onMouseLeave={mouseEnter.onClose}
          >
            {variant.icon}
            <span className="flex-1">{variant.label}</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
