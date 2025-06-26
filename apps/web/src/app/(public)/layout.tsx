import type { Metadata } from 'next';
import { Geist as Font_Sans, Geist_Mono as Font_Mono } from 'next/font/google';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';
import type { CSSProperties } from 'react';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import Sidebar from './components/sidebar';
import BackgroundProvider from '@/components/providers/background-provider';
import NavTrackPlayer from './components/nav-track-player';

/**
 * @todo Room Theme (Change Page Background, Sidebar Background) Only First.
 * @todo Plugins is Client-Side Only! Refactor! (Remove from Backend)
 */

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
            <BackgroundProvider />
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <div className="flex flex-1 relative items-stretch">
                <Sidebar />
                <div className="flex-1 relative overflow-hidden">
                  {children}
                </div>
              </div>
              <div className="h-12 border-t bg-background flex items-center justify-center">
                <div className="w-[260]">
                  <NavTrackPlayer />
                </div>
              </div>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
