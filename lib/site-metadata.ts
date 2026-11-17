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
      url: '/og.png?v=portfolio',
      width: 1925,
      height: 1143,
      alt: "Manav's portfolio desktop with Bliss wallpaper",
    },
  ],
} satisfies Metadata['openGraph'];
