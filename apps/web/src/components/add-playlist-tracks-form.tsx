import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import {
  Dropzone,
  DropzoneImage,
  useDropzone,
} from '@workspace/ui/components/dropzone';
import { FieldWrap, InputField } from '@workspace/ui/components/fields';
import { FormField } from '@workspace/ui/components/form';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

export default function AddPlaylistTracksForm() {
  const {
    fields: tracks,
    append: addTrack,
    remove: removeTrack,
    update: updateTrack,
    move: moveTrack,
    swap: swapTracks,
    replace: replaceTracks,
  } = useFieldArray<{ tracks: any[] }>({
    name: 'tracks',
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.flac'],
    },
    multiple: true,
    noDrag: true,
    onDrop: (files) => {
      files.forEach((file) => {
        addTrack({
          title: file.name,
          file,
        });
      });
    },
  });

  return (
    <>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-mono">Playlist's Tracks</span>
          <Button size={'xs'} {...getRootProps()}>
            <input {...getInputProps()} />
            <PlusIcon />
            <span>Upload File</span>
          </Button>
        </div>
        <div className="flex-1">
          <div className="size-full rounded-xl bg-muted/50 border relative overflow-hidden">
            <div className="absolute size-full inset-0 overflow-y-auto p-6 gap-6 flex flex-col">
              {tracks.map((track, i) => (
                <FormField
                  name={`tracks.${i}`}
                  key={track.id}
                  render={({ field }) => (
                    <FieldWrap>
                      <div className="flex flex-col gap-4 p-6 bg-background/50 rounded-3xl border border-border">
                        <div className="flex items-center gap-4">
                          <FormField
                            name={`tracks.${i}.cover`}
                            render={({ field }) => (
                              <div className="size-32">
                                <DropzoneImage
                                  className="border-border"
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
                              </div>
                            )}
                          />
                          <div className="flex-1">
                            <FormField
                              name={`tracks.${i}.title`}
                              render={({ field }) => (
                                <FieldWrap
                                  label="Track Title"
                                  description="Enter the title of the track."
                                >
                                  <InputField {...field} />
                                </FieldWrap>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </FieldWrap>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
