import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Manav — 3D Designer & Game Developer',
    template: '%s — Manav',
  },
  description:
    'The portfolio of Manav Bhavin Soni — student, 3D designer, game developer, and builder.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
