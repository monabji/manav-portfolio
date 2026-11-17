import type { Metadata } from 'next';

export const siteOpenGraph = {
  type: 'website',
  url: '/',
  siteName: 'Manav - Portfolio',
  title: "Manav's portfolio",
  description:
    'The portfolio of Manav Bhavin Soni - student, 3D designer, game developer, and builder.',
  images: [
    {
      url: '/og.png?v=bliss',
      width: 365,
      height: 274,
      alt: 'Bliss wallpaper: green hills beneath a blue sky',
    },
  ],
} satisfies Metadata['openGraph'];
