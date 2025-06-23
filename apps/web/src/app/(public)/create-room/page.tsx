'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { FormField, Form } from '@workspace/ui/components/form';
import { InputField, FieldWrap } from '@workspace/ui/components/fields';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@workspace/ui/components/button';
import { PlusIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { backendClient } from '@/lib/clients/backend';

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: '',
    },
  });

  const onCreate = useMutation({
    mutationFn: async (data: any) => {
      await backendClient.createRoom(data);
    },
  });

  const onSubmit = async (data: any) => {
    return onCreate.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form
        className="min-h-screen flex flex-col items-center py-32"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Create Room</CardTitle>
            <CardDescription>
              You can invite others to join and listen to music together.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              name={'name'}
              render={({ field }) => (
                <FieldWrap label="Room Name">
                  <InputField
                    {...field}
                    placeholder="Enter room name"
                    autoFocus
                    autoComplete="off"
                  />
                </FieldWrap>
              )}
            />
          </CardContent>
          <CardFooter className="border-t justify-end">
            <Button variant={'outline'} type={'submit'}>
              <PlusIcon />
              <span>Create Room</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
