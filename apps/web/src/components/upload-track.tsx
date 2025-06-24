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
import { Dropzone, DropzoneImage } from '@workspace/ui/components/dropzone';
import { Button } from '@workspace/ui/components/button';

interface UploadTrackProps extends UseDisclosure {
  onCreate?: (track: Api.Track) => void | Promise<void>;
  onError?: (error: any) => void;
}
type FormData = z.infer<typeof backendClient.validations.uploadTrack>;

export default function UploadTrack({
  isOpen,
  onClose,
  onOpenChange,
  onError,
  onCreate: onCreateInput,
}: UploadTrackProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(backendClient.validations.uploadTrack),
    defaultValues: {
      title: '',
      track: undefined,
      cover: undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onCreate = useMutation({
    mutationFn: async (data: FormData) => {
      return backendClient.uploadTrack(data);
    },
    onSuccess: async (track) => {
      await onCreateInput?.(track);
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
              <DialogTitle>Upload Track</DialogTitle>
              <DialogDescription>
                Upload a new track to your library and add it to a playlist.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(
                (v) => onCreate.mutateAsync(v),
                onError,
              )}
              className="flex flex-col gap-6"
            >
              <FormField
                name={'title'}
                control={form.control}
                render={({ field }) => (
                  <FieldWrap
                    label="Track Title"
                    description="Enter the title of the track."
                  >
                    <InputField {...field} />
                  </FieldWrap>
                )}
              />
              <FormField
                name={'track'}
                control={form.control}
                render={({ field }) => (
                  <FieldWrap
                    label="MP3 File"
                    description="Select an MP3 file to upload. The file should be less than 100MB."
                  >
                    <Dropzone
                      {...field}
                      onChange={(f) => {
                        field.onChange(f);
                        if (f) form.setValue('title', f?.name);
                      }}
                      accept={{
                        'audio/mpeg': ['.mp3'],
                      }}
                      preview={() => (
                        <FormField
                          name={'cover'}
                          control={form.control}
                          render={({ field }) => (
                            <DropzoneImage
                              accept={{
                                'image/*': [
                                  '.jpg',
                                  '.jpeg',
                                  '.png',
                                  '.webp',
                                  '.gif',
                                ],
                              }}
                              {...field}
                            />
                          )}
                        />
                      )}
                    />
                  </FieldWrap>
                )}
              />
              <DialogFooter>
                <Button
                  type={'submit'}
                  variant={'secondary'}
                  disabled={isSubmitting || !isValid}
                >
                  {onCreate.isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
