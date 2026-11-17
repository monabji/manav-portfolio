import type { Metadata } from 'next';
import { ProjectsWindow } from '@/components/projects-window';
import { siteOpenGraph } from '@/lib/site-metadata';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Projects',
  alternates: { canonical: '/projects' },
  openGraph: { ...siteOpenGraph, url: '/projects' },
  description: 'Software, game development, hardware, AI, and 3D design projects by Manav Bhavin Soni.',
};

export default function ProjectsPage() {
  return <main className="route-stage" id="main-content"><ProjectsWindow /></main>;
}
