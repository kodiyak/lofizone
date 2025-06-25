'use client';

import { useRoomController } from '@/lib/store/use-room-controller';
import { CellSignalHighIcon } from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Volume2Icon, VolumeOffIcon } from 'lucide-react';
import React from 'react';

export default function RoomMembers() {
  const members = useRoomController((state) => state.members);

  return (
    <>
      {members.map((member, i) => (
        <div
          className="flex items-center gap-2 p-2 rounded-xl pr-5 bg-background/50 border"
          key={member.memberId}
        >
          <div className="flex justify-between items-center">
            <Avatar className="bg-muted border size-8">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/lorelei/svg?seed=User${i + 1}`}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 text-left flex flex-col">
            <span className="font-medium text-sm">{member.memberId}</span>
            {/* <span className="text-muted-foreground text-xs">
              Listening to lofi
            </span> */}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground [&>svg]:size-4 opacity-50">
              {member.muted ? <VolumeOffIcon /> : <Volume2Icon />}
            </div>
            {member.host && (
              <CellSignalHighIcon className="size-4 text-success" />
            )}
          </div>
        </div>
      ))}
    </>
  );
}
