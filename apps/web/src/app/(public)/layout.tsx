import type { Metadata } from 'next';
import { Geist as Font_Sans, Geist_Mono as Font_Mono } from 'next/font/google';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';
import Wallpaper from '@/assets/images/wallpaper.png';
import Image from 'next/image';
import NavTop from './components/nav-top';
import type { CSSProperties } from 'react';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

const sans = Font_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});
const mono = Font_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased font-sans dark',
          sans.variable,
          mono.variable,
        )}
        style={
          {
            '--nav-top-height': 'calc(var(--spacing)* 10)',
          } as CSSProperties
        }
      >
        <QueryProvider>
          <AuthProvider>
            <NavTop />
            <div className="flex flex-col pt-[calc(var(--nav-top-height)+1px)] relative overflow-hidden">
              <div className="absolute -z-10 w-[50vw] right-0 top-0 -translate-y-1/5 translate-x-1/2">
                <div className="size-full absolute left-0 top-0 bg-gradient-to-b from-transparent to-background"></div>
                <div className="size-full absolute left-0 top-0 bg-gradient-to-l from-transparent to-background"></div>
                <Image
                  src={Wallpaper}
                  alt={'Wallpaper Lofi'}
                  className="w-full h-screen object-cover object-center"
                />
              </div>
              {children}
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
