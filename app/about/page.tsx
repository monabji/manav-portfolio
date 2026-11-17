import type { Metadata } from 'next';
import { AboutWindow } from '@/components/about-window';
import { siteOpenGraph } from '@/lib/site-metadata';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
  openGraph: { ...siteOpenGraph, url: '/about' },
  description:
    'Meet Manav Bhavin Soni, a computer science student, aspiring 3D designer, and game developer.',
};

export default function AboutPage() {
  return (
    <main className="route-stage" id="main-content"><AboutWindow /></main>
  );
}
