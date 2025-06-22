import { authClient } from '@/lib/authClient';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@workspace/ui/components/card';
import { DiscordIcon } from '@workspace/ui/components/icons';
import React from 'react';

export default function RoomDiscordJoin() {
  const onAuth = useMutation({
    mutationKey: ['discord-join'],
    mutationFn: () => authClient.signIn.social({ provider: 'discord' }),
  });
  return (
    <>
      <Card className="w-full dark:bg-purple-500/5 bg-purple-50/5 border-purple-500/20 text-purple-500">
        <div className="flex items-start gap-4 px-6">
          <DiscordIcon className="size-8 relative rounded-full -rotate-[20deg]" />
          <CardHeader className="flex-1 px-0">
            <CardTitle>Login with Discord to Join Room</CardTitle>
            <CardDescription className="dark:text-purple-300 text-purple-600">
              Click the button below to authenticate with Discord and join the
              room.
            </CardDescription>
          </CardHeader>
        </div>
        <CardFooter className="justify-end">
          <Button
            variant={'ghost-purple'}
            className="rounded-full"
            disabled={onAuth.isPending}
            onClick={() => onAuth.mutate()}
          >
            Login with Discord
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
