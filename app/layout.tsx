import type { Metadata } from 'next';

import { DesktopShell } from '@/components/desktop-shell';

import './tokens.css';
import './globals.css';
import './windows7.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://manav-bhavin-soni-portfolio.monabji.chatgpt.site'),
  title: {
    default: 'Manav - 3D Designer & Game Developer',
    template: '%s - Manav',
  },
  description:
    'The portfolio of Manav Bhavin Soni - student, 3D designer, game developer, and builder.',
  alternates: {
    canonical: '/',
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
        width: 1733,
        height: 908,
        alt: 'Manav, a boy who loves tech, in a bright Frutiger Aero landscape',
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
        <DesktopShell>{children}</DesktopShell>
      </body>
    </html>
  );
}
