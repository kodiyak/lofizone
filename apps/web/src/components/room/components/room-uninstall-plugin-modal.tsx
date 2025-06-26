import React from 'react';
import type { RoomInstallPluginProps } from '../types';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { PluginProvider } from '@plugins/core';
import { useMutation } from '@tanstack/react-query';
import { backendClient } from '@/lib/clients/backend';
import { TrashIcon } from '@phosphor-icons/react';

type RoomUninstallPluginModalProps = RoomInstallPluginProps & UseDisclosure;

export default function RoomUninstallPluginModal({
  plugin,
  isOpen,
  onOpenChange,
  onClose,
  roomId,
}: RoomUninstallPluginModalProps) {
  const onUninstall = useMutation({
    mutationFn: async () => {
      await backendClient.uninstallPlugin({
        pluginId: plugin.name,
        roomId,
      });
    },
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uninstall Plugin</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative size-18 rounded-3xl border bg-muted/15 flex items-center justify-center">
                <PluginProvider
                  name={plugin.name}
                  componentName="Icon"
                  className="size-8"
                />
                <div className="absolute -right-2 -bottom-2 p-1 size-8 backdrop-blur-xs bg-background/60 border rounded-xl flex items-center justify-center">
                  <TrashIcon className="text-destructive" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-medium">{plugin.title}</span>
                <span className="text-sm text-muted-foreground">
                  {'Click below to confirm uninstalling this plugin.'}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={onUninstall.isPending}
                onClick={() => onUninstall.mutate()}
              >
                {onUninstall.isPending ? 'Uninstalling...' : 'Uninstall Plugin'}
              </Button>
            </DialogFooter>
            {/* <div className="w-full aspect-square flex flex-col items-center justify-center gap-12 rounded-xl bg-muted/30 border">
              <div className="size-32 rounded-full bg-background/50 ring-8 ring-ring/10 flex items-center justify-center text-muted-foreground">
                <PluginProvider
                  componentName="Icon"
                  name={plugin.name}
                  className="size-14"
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <span className="text-lg font-bold">{plugin.title}</span>
                <span className="text-sm text-muted-foreground max-w-[280]">
                  {plugin.description}
                </span>
              </div>
            </div>
            */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
