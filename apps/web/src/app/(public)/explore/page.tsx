'use client';

import type { NextPage } from 'next';

import RoomCard from '@/components/room-card';
import { useBackendAPI } from '@/lib/hooks/useBackendAPI';
import type { Api } from '@workspace/core';

const Page: NextPage = () => {
  const { data } = useBackendAPI<Api.Room[]>('/rooms');
  const rooms = data || [];

  return (
    <>
      <div className="flex flex-col py-4">
        <div className="container mx-auto min-h-screen">
          <div className="grid grid-cols-5 gap-4">
            {rooms.map((room, i) => (
              <RoomCard room={room} key={`card.${i}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
