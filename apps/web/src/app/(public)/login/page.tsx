'use client';

import { authClient } from '@/lib/authClient';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { DiscordIcon } from '@workspace/ui/components/icons';
import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Please login to access your rooms and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={'ghost-purple'}
            size={'lg'}
            className="rounded-full"
            onClick={() => {
              authClient.signIn.social({
                provider: 'discord',
              });
            }}
          >
            <DiscordIcon />
            <span>Login with Discord</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
