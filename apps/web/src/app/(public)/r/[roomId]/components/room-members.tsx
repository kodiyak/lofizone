'use client';

import { useRoomStore } from '@/lib/store/use-room-store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Volume2Icon, VolumeOffIcon } from 'lucide-react';
import React from 'react';

export default function RoomMembers() {
  const members = useRoomStore((state) => state.members);

  return (
    <>
      {members.map((member, i) => (
        <div
          className="flex flex-col gap-2 p-4 rounded-lg bg-background border"
          key={member.memberId}
        >
          <div className="flex justify-between items-center">
            <Avatar className="bg-muted border size-12">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/lorelei/svg?seed=User${i + 1}`}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {member.host && <Badge>{member.host ? 'Host' : 'Member'}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-left flex flex-col">
              <span className="font-semibold">{member.memberId}</span>
              <span className="text-muted-foreground text-xs">
                Listening to lofi
              </span>
            </div>
            <div className="text-muted-foreground opacity-50">
              {member.muted ? <VolumeOffIcon /> : <Volume2Icon />}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
