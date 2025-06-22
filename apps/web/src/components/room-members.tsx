'use client';

import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import type { Api } from '@workspace/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import React from 'react';

interface RoomMembersProps {
  roomId: string;
}

export default function RoomMembers({ roomId }: RoomMembersProps) {
  const { data } = useBackendAPI<Api.RoomMember[]>(`/rooms/${roomId}/members`);
  const members = data ?? [];

  return (
    <>
      {members.map((member, i) => (
        <Button
          className="justify-start h-auto gap-3 py-2"
          variant={'outline'}
          key={member.memberId}
        >
          <Avatar className="bg-muted border size-12">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=User${i + 1}`}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left flex flex-col">
            <span className="font-semibold">{member.memberId}</span>
            <span className="text-muted-foreground text-xs">
              Listening to lofi
            </span>
          </div>
        </Button>
      ))}
    </>
  );
}
