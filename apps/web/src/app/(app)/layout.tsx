import type { Metadata } from 'next';
import { Geist as Font_Sans, Geist_Mono as Font_Mono } from 'next/font/google';
import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';

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
      >
        {children}
      </body>
    </html>
  );
}
