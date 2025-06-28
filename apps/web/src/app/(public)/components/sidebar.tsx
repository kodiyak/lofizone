'use client';

import React from 'react';
import Logo from '@/assets/images/logo-square.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { HomeIcon, LibraryIcon, SettingsIcon } from 'lucide-react';
import { GlobeIcon } from '@phosphor-icons/react';
import { authClient } from '@/lib/authClient';
import { Skeleton } from '@workspace/ui/components/skeleton';
import AuthActions from './auth-actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';

export default function Sidebar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <>
      <div className="border-r w-[200] flex flex-col bg-background/80 backdrop-blur-xs">
        <div className="flex items-center p-6">
          <Link href={'/'}>
            <Image
              src={Logo}
              alt={'Logo'}
              width={50}
              className="size-12 rounded-2xl"
            />
          </Link>
        </div>
        <div className="flex flex-col items-start px-6">
          {[
            {
              name: 'Home',
              href: '/',
              icon: <HomeIcon />,
            },
            {
              name: 'Explore',
              href: '/explore',
              icon: <GlobeIcon />,
            },
            {
              name: 'Library',
              href: '/library',
              icon: <LibraryIcon />,
            },
            {
              name: 'Settings',
              href: '/settings',
              icon: <SettingsIcon />,
            },
          ].map((item) => (
            <Button asChild key={item.name} variant={'ghost'}>
              <Link
                href={item.href}
                className="justify-start pl-4! pr-6! rounded-3xl"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
        <div className="flex-1"></div>
        <div className="p-4">
          {isPending ? (
            <Skeleton className="h-10" />
          ) : (
            <>
              {session ? (
                <AuthActions user={session.user}>
                  <Button className="w-full justify-start" variant={'ghost'}>
                    <Avatar className="size-8">
                      <AvatarImage src={session?.user?.image || undefined} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{session?.user?.name}</span>
                  </Button>
                </AuthActions>
              ) : (
                <Button asChild variant={'outline'} className="w-full">
                  <Link href={'/login'}>Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
