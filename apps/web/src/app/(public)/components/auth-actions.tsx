'use client';

import React, { type PropsWithChildren } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@workspace/ui/components/dropdown-menu';
import type { User } from 'better-auth';
import { LogOutIcon } from 'lucide-react';
import { authClient } from '@/lib/authClient';

export default function AuthActions({
  children,
  user,
}: PropsWithChildren<{
  user: User;
}>) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuLabel className="truncate">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-2" />
          <DropdownMenuItem
            onClick={() => {
              authClient.signOut();
            }}
          >
            <span>Logout</span>
            <LogOutIcon />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
