import type { Metadata } from 'next';

import { DesktopShell } from '@/components/desktop-shell';
import { DesktopSettingsProvider } from '@/components/desktop-settings';
import { publicPath } from '@/lib/public-path';
import { siteOpenGraph } from '@/lib/site-metadata';

import './tokens.css';
import './globals.css';
import './windows7.css';
import '7.css/dist/gui/window.css';
import '7.css/dist/gui/scrollbar.css';
import './explorer.css';
import './desktop-theme.css';
import './sticky-notes.css';
import './taskbar-clock.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://monabji.github.io/manav-portfolio/'),
  title: {
    default: 'Manav - 3D Designer & Game Developer',
    template: '%s - Manav',
  },
  description:
    'The portfolio of Manav Bhavin Soni - student, 3D designer, game developer, and builder.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: publicPath('/favicon.png'),
  },
  openGraph: siteOpenGraph,
  twitter: {
    card: 'summary_large_image',
    title: 'Manav - 3D Designer & Game Developer',
    description:
      'The portfolio of Manav Bhavin Soni - student, 3D designer, game developer, and builder.',
    images: ['/og.png?v=bliss'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DesktopSettingsProvider><DesktopShell>{children}</DesktopShell></DesktopSettingsProvider>
      </body>
    </html>
  );
}
