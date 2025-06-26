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

type RoomInstallPluginModalProps = RoomInstallPluginProps & UseDisclosure;

export default function RoomInstallPluginModal({
  plugin,
  isOpen,
  onOpenChange,
  onClose,
  roomId,
}: RoomInstallPluginModalProps) {
  const onInstall = useMutation({
    mutationFn: async () => {
      await backendClient.installPlugin({
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
            <DialogTitle>Install Plugin</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square flex flex-col items-center justify-center gap-12 rounded-xl bg-muted/30 border">
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
            <DialogFooter>
              <Button
                disabled={onInstall.isPending}
                onClick={() => onInstall.mutate()}
              >
                Confirm Installation
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
