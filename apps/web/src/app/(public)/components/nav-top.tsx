'use client';

import { authClient } from '@/lib/authClient';
import { CaretDownIcon } from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Skeleton } from '@workspace/ui/components/skeleton';
import Link from 'next/link';
import React from 'react';

export default function NavTop() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <div className="fixed w-full z-50 left-0 top-0 h-[var(--nav-top-height)] border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto h-full flex items-center">
        <div className="flex-1">
          <div className="size-10 rounded-lg bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-900"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full" variant={'outline'}>
            Create Room
          </Button>
          {isPending ? (
            <Skeleton className="w-[180px] h-10 rounded-sm" />
          ) : (
            <>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className="pl-2 rounded-full">
                      <Avatar className="size-6">
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left items-start">
                        <span>{session.user.email}</span>
                      </div>
                      <CaretDownIcon className="size-3!" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        authClient.signOut();
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="rounded-full" asChild>
                  <Link href={'/login'}>Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
