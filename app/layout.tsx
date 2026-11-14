import type { Metadata } from 'next';

import { DesktopShell } from '@/components/desktop-shell';
import { DesktopSettingsProvider } from '@/components/desktop-settings';

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
    icon: '/crystal/browser.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Manav - Portfolio',
    title: 'Manav - 3D Designer & Game Developer',
    description: 'a boy who loves tech',
    images: [
      {
        url: '/og.png',
        width: 1216,
        height: 760,
        alt: 'Screenshot of the portfolio home page with Manav displayed',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manav - 3D Designer & Game Developer',
    description: 'a boy who loves tech',
    images: ['/og.png'],
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
