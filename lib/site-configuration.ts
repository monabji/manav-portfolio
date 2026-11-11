import { softwareProjects, designProjects, experience, type Project } from '@/config/portfolio';

export type PersonalShortcut = { id: string; label: string; href: string; icon: string; mode?: 'link' | 'window' };
export type Experience = { role: string; organization: string; logo: string; alt: string };
export type DesktopSettings = {
  wallpaper: string;
  iconOverrides: Record<string, string>;
  shortcuts: PersonalShortcut[];
  softwareProjects: Project[];
  designProjects: Project[];
  experience: Experience[];
};
export const defaultSettings: DesktopSettings = {
  wallpaper: '', iconOverrides: {}, shortcuts: [], softwareProjects, designProjects,
  experience: experience.map(item => ({ ...item })),
};
