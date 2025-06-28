import PluginsGrid from '@/components/plugins-grid';
import React from 'react';
import RoomTrack from '../sections/room-track';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import type { RoomScreenProps } from '../types';
import { Button } from '@workspace/ui/components/button';
import { LayoutGridIcon } from 'lucide-react';
import Link from 'next/link';
import { EmptyState, EmptyIcon } from '@workspace/ui/components/empty';
import { ZapOffIcon } from 'lucide-react';
import RoomPlaylist from '../sections/room-playlist';

export default function RoomHomeScreen({ room }: RoomScreenProps) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-6 h-[50vh] items-stretch">
          <RoomPlaylist />
          <RoomTrack className="flex-1" />
        </div>
        <Separator className="my-6" />
        <Card className="">
          <CardHeader>
            <CardTitle>Plugins</CardTitle>
            <CardDescription>
              Plugins are used to extend the functionality of the room.
            </CardDescription>
            <CardAction>
              <Button variant={'outline'} asChild>
                <Link href={`/r/${room.roomId}/plugins`}>
                  <LayoutGridIcon />
                  <span>Explore Plugins</span>
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {room.plugins.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                <PluginsGrid room={room} />
              </div>
            ) : (
              <EmptyState
                icon={<EmptyIcon icon={<ZapOffIcon />} />}
                title="No Plugins Available"
                description="There are no plugins available in this room."
                className="py-32"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
