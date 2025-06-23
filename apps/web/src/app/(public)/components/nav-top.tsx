'use client';

import { authClient } from '@/lib/authClient';
import { MonitorIcon, SignInIcon, SignOutIcon } from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Skeleton } from '@workspace/ui/components/skeleton';
import Link from 'next/link';
import React from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@workspace/ui/components/menubar';
import Image from 'next/image';
import Logo from '@/assets/images/logo-square.png';
import NavTrackPlayer from './nav-track-player';

export default function NavTop() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <>
      <div className="fixed w-full z-50 left-0 top-0 h-[var(--nav-top-height)] border-b border-border/50 bg-background/10 backdrop-blur-xs">
        <Menubar className="rounded-none bg-transparent border-0 container mx-auto h-full px-0">
          <div className="flex-1">
            <Link href={'/'}>
              <Image
                src={Logo}
                alt={'Logo'}
                width={50}
                className="size-7 rounded-lg border border-border/50"
              />
            </Link>
          </div>
          <div className="w-1/5 h-full">
            <NavTrackPlayer />
          </div>
          <div className="flex-1 flex items-center gap-1 justify-end">
            {isPending && (
              <Skeleton className="w-[120] backdrop-blur-lg h-7 rounded-sm" />
            )}
            {!session && !isPending && (
              <Link
                href={'/login'}
                className="gap-2 flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none backdrop-blur-xs hover:bg-accent/50 hover:text-accent-foreground"
              >
                <SignInIcon className="size-4" />
                <span>Login</span>
              </Link>
            )}
            {session && !isPending && (
              <>
                <MenubarMenu>
                  <MenubarTrigger className="gap-2">
                    <Avatar className="size-5 rounded-sm">
                      <AvatarImage src={session?.user?.image || undefined} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{session?.user?.name}</span>
                  </MenubarTrigger>
                  <MenubarContent align={'end'}>
                    <MenubarItem asChild>
                      <Link href={'/create-room'}>
                        Create Room
                        <MenubarShortcut>
                          <MonitorIcon />
                        </MenubarShortcut>
                      </Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem
                      onClick={() => {
                        authClient.signOut();
                      }}
                    >
                      Sign Out
                      <MenubarShortcut>
                        <SignOutIcon />
                      </MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </>
            )}
          </div>
        </Menubar>
      </div>
    </>
  );
}
