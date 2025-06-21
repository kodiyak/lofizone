import type { NextPage } from 'next';

import RoomCard from '@/components/room-card';

const Page: NextPage = async () => {
  return (
    <>
      <div className="container mx-auto min-h-screen backdrop-blur-lg z-30 rounded-t-2xl border">
        <div className="grid grid-cols-5 gap-4 p-8">
          {Array.from({ length: 32 }).map((_, i) => (
            <RoomCard key={`card.${i}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
