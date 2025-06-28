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
import PluginsProvider from '@/components/providers/plugins-provider';
import DebugProvider from '@/components/providers/debug-provider';

/**
 * @todo Room Theme (Change Page Background, Sidebar Background) Only First.
 * @todo Sync Room Members (Join/Leave, Play/Pause/Next/Previous, Volume, Seek) - 26.06 - 3h (2h)
 * @todo Plugins (Add/Remove, Enable/Disable, Settings) - 26.06 - 5h (2h)
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
  title: 'lofi.surf',
  description: 'Lo-fi Surf - Your Lofi Music Experience',
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
            <PluginsProvider>
              <BackgroundProvider />
              <div className="flex flex-col w-full h-screen overflow-hidden">
                <div className="flex flex-1 relative items-stretch">
                  <Sidebar />
                  <div className="flex-1 relative overflow-hidden">
                    <DebugProvider />
                    <div className="size-full inset-0 absolute">{children}</div>
                  </div>
                </div>
                <div className="h-12 shrink-0 border-t bg-background flex items-center justify-center">
                  <div className="w-[360]">
                    <NavTrackPlayer />
                  </div>
                </div>
              </div>
            </PluginsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
