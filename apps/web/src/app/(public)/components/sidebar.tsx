'use client';

import React from 'react';
import Logo from '@/assets/images/logo-square.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { HomeIcon, LibraryIcon, SettingsIcon } from 'lucide-react';
import { GlobeIcon } from '@phosphor-icons/react';

export default function Sidebar() {
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
        <div className="flex flex-col px-6">
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
            <Button
              asChild
              key={item.name}
              variant={'ghost'}
              className="justify-start"
              size={'sm'}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
