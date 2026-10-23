import { softwareProjects, designProjects, experience, desktopUtilities, type Project } from '@/config/portfolio';
import { publicPath } from '@/lib/public-path';

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

export function safeUrl(value: string, image = false) {
  if (/^\/(?!\/)[^\s\\]*$/.test(value)) return true;
  try { const url = new URL(value); return !url.username && !url.password && (url.protocol === 'https:' || (!image && url.protocol === 'mailto:')); } catch { return false; }
}
function string(value: unknown, max: number, optional = false): string {
  if (typeof value !== 'string' || value.length > max || (!optional && !value.trim())) throw new Error('A text field is missing or too long.');
  return value.trim();
}
function url(value: unknown, optional = false): string {
  const text = string(value, 2048, optional);
  if ((text || !optional) && !safeUrl(text, true)) throw new Error('Use HTTPS image URLs or paths within this site.');
  return publicPath(text);
}
function array(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new Error('Invalid list or too many items.');
  return value;
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid configuration.');
  return value as Record<string, unknown>;
}
function projects(value: unknown): Project[] {
  const result = array(value, 100).map(item => {
    const p = record(item);
    return {
      title: string(p.title, 160), status: string(p.status, 120, true), description: string(p.description, 5000),
      icon: url(p.icon), image: url(p.image ?? '', true), alt: string(p.alt ?? '', 500, true), category: string(p.category ?? '', 120, true),
      tags: array(p.tags, 20).map(tag => string(tag, 80, true)).filter(Boolean),
      links: array(p.links, 10).map(item => { const link = record(item); const href = string(link.href, 2048); if (!safeUrl(href)) throw new Error('Invalid project link.'); return { label: string(link.label, 120), href }; }),
    };
  });
  if (new Set(result.map(p => p.title.toLowerCase())).size !== result.length) throw new Error('Each project needs a unique title.');
  return result;
}
export function validateSettings(value: unknown): DesktopSettings {
  const input = record(value);
  const overrides = record(input.iconOverrides);
  if (Object.keys(overrides).length > 200) throw new Error('Too many icon overrides.');
  const iconOverrides = Object.fromEntries(Object.entries(overrides).map(([key, value]) => [string(key, 180), url(value)]));
  const shortcuts = array(input.shortcuts, 40).map(item => {
    const s = record(item); const href = string(s.href, 2048);
    if (!safeUrl(href) || (s.mode === 'window' && !href.startsWith('https://'))) throw new Error('Applications need a safe HTTPS address.');
    const id = string(s.id, 100); if (!/^[a-zA-Z0-9_-]+$/.test(id) || desktopUtilities.some(app => app.id === id)) throw new Error('Invalid or reserved application ID.');
    return { id, label: string(s.label, 80), href, icon: url(s.icon), mode: s.mode === 'window' ? 'window' as const : 'link' as const };
  });
  if (new Set(shortcuts.map(s => s.id)).size !== shortcuts.length) throw new Error('Duplicate application IDs.');
  return {
    wallpaper: url(input.wallpaper ?? '', true), iconOverrides, shortcuts,
    softwareProjects: projects(input.softwareProjects), designProjects: projects(input.designProjects),
    experience: array(input.experience, 50).map(item => { const e = record(item); return { role: string(e.role, 200), organization: string(e.organization, 200), logo: url(e.logo), alt: string(e.alt ?? '', 300, true) }; }),
  };
}
