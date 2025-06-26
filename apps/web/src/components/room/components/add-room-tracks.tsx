'use client';

import PlaylistsCommand from '@/components/playlists-command';
import TracksCommand from '@/components/tracks-command';
import {
  backendClient,
  type AddTracksToRoomRequest,
} from '@/lib/clients/backend';
import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import { PlaylistIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import type { Api } from '@workspace/core';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Form, FormField } from '@workspace/ui/components/form';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddRoomTracksProps extends UseDisclosure {
  room: Api.Room;
  onAdded?: () => void | Promise<void>;
}

export default function AddRoomTracks({
  isOpen,
  onOpenChange,
  onClose,
  room,
  onAdded,
}: AddRoomTracksProps) {
  const form = useForm({
    defaultValues: {
      roomId: room.roomId,
      playlistId: null,
      tracksIds: [],
    },
  });
  const [{ step }, setState] = useState({
    step: 0,
  });
  const { data: playlists = [] } = useBackendAPI<Api.Playlist[]>(`/playlists`, {
    query: {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    },
  });
  const { data: tracks = [] } = useBackendAPI<Api.Track[]>(`/tracks`, {
    params: {
      playlistId: form.watch('playlistId'),
    },
    query: {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    },
  });

  const onSubmit = useMutation({
    mutationFn: async (data: AddTracksToRoomRequest) => {
      await backendClient.addTracksToRoom({
        roomId: data.roomId,
        tracksIds: data.tracksIds,
      });
    },
    onSuccess: async () => {
      onClose();
      await onAdded?.();
    },
  });
  const onStepSubmit = async (data: AddTracksToRoomRequest) => {
    if (step + 1 >= steps.length) {
      await onSubmit.mutateAsync(data);
      return;
    }
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const { tracksIds } = form.watch();
  const [selectedPlaylist, setPlaylist] = useState<Api.Playlist | null>(null);
  const { isSubmitting } = form.formState;

  const steps = [
    {
      title: 'Playlist',
      label: selectedPlaylist?.title || 'Playlist',
      description: 'Choose a playlist to add tracks from.',
      content: (
        <>
          <FormField
            name={'playlistId'}
            key={'playlistId'}
            render={({ field }) => (
              <PlaylistsCommand
                playlists={playlists}
                value={field.value}
                listClassName={'p-4 max-h-max'}
                autoFocus
                onChange={(v) => {
                  const playlist = playlists.find((p) => p.id === v);
                  setPlaylist(() => playlist || null);
                  field.onChange(v);
                  setState((prev) => ({ ...prev, step: prev.step + 1 }));
                }}
                onGoBack={() => {
                  setState((prev) => ({ ...prev, step: prev.step - 1 }));
                }}
              />
            )}
          />
        </>
      ),
    },
    {
      title: 'Select Tracks',
      description: 'Choose tracks to add to the room.',
      content: (
        <>
          <FormField
            name={'tracksIds'}
            key={'tracksIds'}
            render={({ field }) => (
              <TracksCommand
                tracks={tracks}
                autoFocus
                className="h-full"
                listClassName={
                  'p-4 h-max max-h-max [&_[data-slot="command-item"]]:mb-0.5'
                }
                onGoBack={() => {
                  setState((prev) => ({ ...prev, step: prev.step - 1 }));
                  setPlaylist(() => null);
                  form.setValue('playlistId', null);
                }}
                {...field}
              />
            )}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setState({ step: 0 });
      setPlaylist(() => null);
      form.reset({
        roomId: room.roomId,
        playlistId: null,
        tracksIds: [],
      });
    }
  }, [isOpen, room.roomId]);

  return (
    <>
      <Form {...form}>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="px-0 pb-0">
            <DialogHeader className="px-6">
              <DialogTitle>{steps[step]?.title}</DialogTitle>
              <DialogDescription>{steps[step]?.description}</DialogDescription>
            </DialogHeader>
            <form
              className="flex flex-col rounded-b-3xl overflow-hidden"
              onSubmit={form.handleSubmit(onStepSubmit)}
            >
              <div className="flex flex-col h-[50vh]">
                {steps[step]?.content || null}
              </div>
              <div className="flex items-end gap-1 px-6 py-4">
                <Button
                  size={'sm'}
                  variant={'outline'}
                  disabled={step === 0}
                  onClick={() => {
                    setState((prev) => ({ ...prev, step: prev.step - 1 }));
                    setPlaylist(() => null);
                    form.setValue('playlistId', null);
                  }}
                >
                  <PlaylistIcon />
                  <span>Playlists</span>
                </Button>
                <div className="flex-1"></div>
                <Button
                  size={'sm'}
                  type={'submit'}
                  disabled={tracksIds.length === 0 || isSubmitting}
                >
                  <span>
                    {[
                      'Add ',
                      tracksIds.length,
                      tracksIds.length > 0 ? ' Song' : ' Songs',
                      ' to Room',
                    ].join('')}
                  </span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
