import type { Metadata } from 'next';

import './globals.css';

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
        width: 1729,
        height: 910,
        alt: 'MANAV - a boy who loves tech',
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
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
