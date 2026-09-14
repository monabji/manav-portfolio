import type { Metadata } from 'next';
import { ProjectsWindow } from '@/components/projects-window';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software, game development, hardware, AI, and 3D design projects by Manav Bhavin Soni.',
};

export default function ProjectsPage() {
  return <main className="route-stage" id="main-content"><ProjectsWindow /></main>;
}
