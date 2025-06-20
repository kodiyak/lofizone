import type { NextPage } from 'next';
import Wallpaper from '@/assets/images/wallpaper.png';
import Image from 'next/image';
import RoomCard from '@/components/room-card';

const Page: NextPage = async () => {
  return (
    <>
      <div className="flex flex-col pt-32 relative overflow-hidden">
        <div className="absolute w-[50vw] right-0 top-0 -translate-y-1/5 translate-x-1/2">
          <div className="size-full absolute left-0 top-0 bg-gradient-to-b from-transparent to-background"></div>
          <div className="size-full absolute left-0 top-0 bg-gradient-to-l from-transparent to-background"></div>
          <Image
            src={Wallpaper}
            alt={'Wallpaper Lofi'}
            className="w-full h-screen object-cover object-center"
          />
        </div>
        <div className="container mx-auto min-h-screen backdrop-blur-lg relative z-30 rounded-t-2xl border">
          <div className="grid grid-cols-5 gap-4 p-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <RoomCard key={`card.${i}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
