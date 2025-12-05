import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/hooks/useTheme';

import '../styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'TraceTrail Intelligence Console',
  description: 'Operational intelligence hub for anomalies, KPIs, and network health.',
  openGraph: {
    title: 'TraceTrail Intelligence Console',
    description: 'Operational intelligence hub for anomalies, KPIs, and network health.',
    siteName: 'TraceTrail',
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <ThemeProvider>
          <a href="#main-content" className="skip-link focus-ring">
            Skip to main content
          </a>
          <div className="min-h-screen bg-background" role="application" aria-label="TraceTrail dashboard">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

