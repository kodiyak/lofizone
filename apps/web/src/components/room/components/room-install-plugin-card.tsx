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

export default function RoomInstallPluginCard(props: RoomInstallPluginProps) {
  const { plugin, isInstalled } = props;
  const install = useDisclosure();
  return (
    <>
      <RoomInstallPluginModal {...install} {...props} />
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
        <CardFooter className="justify-end">
          <Button size={'sm'} onClick={install.onOpen} disabled={isInstalled}>
            {isInstalled ? <CheckIcon /> : <PlusIcon />}
            {isInstalled ? 'Already Installed' : 'Install Now'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
