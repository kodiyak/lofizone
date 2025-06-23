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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FieldWrap, InputField } from '@workspace/ui/components/fields';
import { Button } from '@workspace/ui/components/button';

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
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onCreate = useMutation({
    mutationFn: async (data: FormData) => {
      return backendClient.createPlaylist(data);
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
              <DialogDescription>
                Create a new playlist to organize your favorite tracks.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(
                (v) => onCreate.mutateAsync(v),
                onError,
              )}
              className="flex flex-col"
            >
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
              <DialogFooter>
                <Button
                  type={'submit'}
                  variant={'secondary'}
                  disabled={isSubmitting || !isValid}
                >
                  {onCreate.isPending ? 'Creating...' : 'Create Playlist'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
