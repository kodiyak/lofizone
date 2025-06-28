import { backendClient } from '@/lib/clients/backend';
import { useMutation } from '@tanstack/react-query';
import type { Api } from '@workspace/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Form, FormField } from '@workspace/ui/components/form';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckboxField,
  FieldWrap,
  InputField,
  TextareaField,
} from '@workspace/ui/components/fields';
import { Button } from '@workspace/ui/components/button';
import AddPlaylistTracksForm from './add-playlist-tracks-form';
import { Progress } from '@workspace/ui/components/progress';

interface CreatePlaylistProps extends UseDisclosure {
  onCreate?: (playlist: Api.Playlist) => void | Promise<void>;
  onError?: (error: any) => void;
}
type FormData = z.infer<typeof backendClient.validations.createPlaylist>;

export default function CreatePlaylist({
  isOpen,
  onClose,
  onOpenChange,
  onError,
  onCreate: onCreateInput,
}: CreatePlaylistProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(backendClient.validations.createPlaylist),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
      tracks: [],
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const [progress, setProgress] = useState(0);
  const formState = useRef({
    uploadingTracks: 0,
    uploadedTracks: 0,
  });

  const onCreate = useMutation({
    mutationFn: async (data: FormData) => {
      console.log('Creating playlist with data:', data);
      const playlist = await backendClient.createPlaylist(data);
      Object.assign(formState.current, {
        uploadingTracks: data.tracks?.length || 0,
        uploadedTracks: 0,
      });
      await Promise.all(
        (data.tracks ?? []).map(async (track) => {
          await backendClient.uploadTrack({
            ...track,
            playlistId: playlist.id,
          });
          formState.current.uploadedTracks += 1;
          setProgress(
            (formState.current.uploadedTracks /
              formState.current.uploadingTracks) *
              100,
          );
        }),
      );

      return playlist;
    },
    onSuccess: async (playlist) => {
      await onCreateInput?.(playlist);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  return (
    <>
      <Form {...form}>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-7xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
              <DialogDescription>
                Create a new playlist to organize your favorite tracks.
              </DialogDescription>
            </DialogHeader>
            {isSubmitting ? (
              <>
                <div className="flex-1 rounded-3xl bg-muted/40 border flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-6">
                    <span className="text-xl font-light font-mono animate-pulse">
                      Creating Playlist...
                    </span>
                    <Progress className="w-[350]" value={progress} />
                  </div>
                </div>
              </>
            ) : (
              <form
                onSubmit={form.handleSubmit(
                  (v) => onCreate.mutateAsync(v),
                  onError,
                )}
                className="flex items-stretch flex-1"
              >
                <div className="flex flex-col gap-6 w-[380] pr-6">
                  <FormField
                    name={'name'}
                    control={form.control}
                    render={({ field }) => (
                      <FieldWrap
                        label="Playlist Title"
                        description="Enter a title for your new playlist."
                      >
                        <InputField {...field} placeholder="My Playlist" />
                      </FieldWrap>
                    )}
                  />
                  <FormField
                    name={'description'}
                    control={form.control}
                    render={({ field }) => (
                      <FieldWrap
                        label="Playlist Description"
                        description="Add a brief description for your playlist."
                      >
                        <TextareaField
                          {...field}
                          placeholder={'A collection of my favorite tracks...'}
                        />
                      </FieldWrap>
                    )}
                  />
                  <FormField
                    name={'isPublic'}
                    control={form.control}
                    render={({ field }) => (
                      <FieldWrap
                        label="Is Public"
                        description="Make this playlist public so others can discover it."
                        orientation="horizontal"
                        className="flex-row-reverse gap-3"
                      >
                        <CheckboxField {...field} />
                      </FieldWrap>
                    )}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex-1 flex flex-col pb-6">
                    <AddPlaylistTracksForm />
                  </div>
                  <DialogFooter className="mt-auto justify-end">
                    <Button
                      type={'submit'}
                      variant={'outline'}
                      disabled={isSubmitting || !isValid}
                    >
                      {onCreate.isPending ? 'Creating...' : 'Create Playlist'}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
