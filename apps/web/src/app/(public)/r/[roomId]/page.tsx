import React from 'react';
import Wallpaper from '@/assets/images/wallpaper-2.webp';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { DiscordIcon } from '@workspace/ui/components/icons';
import { ArrowLeftIcon } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Separator } from '@workspace/ui/components/separator';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import RoomProvider from '@/components/providers/room-provider';

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: Props) {
  const { roomId } = await params;

  return (
    <RoomProvider roomId={roomId}>
      <div className="container max-w-2xl mx-auto min-h-screen">
        <div className="flex flex-col p-6 gap-6 backdrop-blur-lg z-30 rounded-2xl border">
          <div className="flex justify-between">
            <Button
              size={'xs'}
              className="rounded-full"
              variant={'ghost'}
              asChild
            >
              <Link href={'/'}>
                <ArrowLeftIcon className="rounded-full bg-muted" />
                <span>Go Back</span>
              </Link>
            </Button>
            <div className="flex flex-col text-right gap-1">
              <div className="flex items-center gap-1 font-mono text-xs">
                <span>5d</span>
                <span>02:24:32</span>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                15/34
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative rounded-2xl border overflow-hidden z-10">
              <div className="absolute left-0 top-0 size-full bg-gradient-to-b from-transparent to-background flex flex-col z-10" />
              <div className="absolute left-0 top-0 size-full bg-gradient-to-br from-transparent to-background flex flex-col z-20">
                <div className="flex-1"></div>
                <div className="flex items-center gap-4 p-4 font-mono">
                  <div className="flex flex-col flex-1">
                    <span className="text-lg">Playlist Name</span>
                    <span className="text-xs text-muted-foreground">
                      Shinobu - Lofi Beats
                    </span>
                  </div>
                  <Select value={'en-US'}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        {
                          label: 'USA',
                          value: 'en-US',
                          flag: 'us',
                        },
                        {
                          label: 'Brazil',
                          value: 'pt-BR',
                          flag: 'br',
                        },
                      ].map((lang) => (
                        <SelectItem
                          key={lang.value}
                          value={lang.value}
                          className="flex items-center gap-2"
                        >
                          <img
                            className="size-4 rounded-sm"
                            src={`https://flagcdn.com/w20/${lang.flag}.png`}
                            alt={lang.label}
                          />
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Image
                src={Wallpaper}
                alt={'Lofi'}
                className="w-full h-[32vh] object-cover object-center"
              />
            </div>
          </div>
          <div className="flex-1">
            {/* <div className="flex flex-col p-4 bg-background border rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Room</h1>
            <p className="text-muted-foreground mb-4">
              Join us for a relaxing session of lofi music and chill vibes.
            </p>
            <div className="flex justify-end">
              <Button className="w-full rounded-full" size={'lg'}>
                Join Room
              </Button>
            </div>
          </div> */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Room</CardTitle>
                <CardDescription>
                  Join us for a relaxing session of lofi music and chill vibes.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Button
                    className="justify-start h-auto gap-3 py-2"
                    variant={'outline'}
                    key={i}
                  >
                    <Avatar className="bg-muted border size-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/lorelei/svg?seed=User${i + 1}`}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left flex flex-col">
                      <span className="font-semibold">User {i + 1}</span>
                      <span className="text-muted-foreground text-xs">
                        Listening to lofi
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
              <Separator />
              <CardFooter>
                <Card className="w-full dark:bg-purple-500/5 bg-purple-50/5 border-purple-500/20 text-purple-500">
                  <div className="flex items-start gap-4 px-6">
                    <DiscordIcon className="size-8 relative rounded-full -rotate-[20deg]" />
                    <CardHeader className="flex-1 px-0">
                      <CardTitle>Login with Discord to Join Room</CardTitle>
                      <CardDescription className="dark:text-purple-300 text-purple-600">
                        Click the button below to authenticate with Discord and
                        join the room.
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardFooter className="justify-end">
                    <Button variant={'ghost-purple'} className="rounded-full">
                      Login with Discord
                    </Button>
                  </CardFooter>
                </Card>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </RoomProvider>
  );
}
