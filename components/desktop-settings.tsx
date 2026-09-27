'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type PersonalShortcut = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export type DesktopSettings = {
  wallpaper: string;
  iconOverrides: Record<string, string>;
  shortcuts: PersonalShortcut[];
};

const STORAGE_KEY = 'manav-desktop-settings-v1';
const defaultSettings: DesktopSettings = { wallpaper: '', iconOverrides: {}, shortcuts: [] };

const DesktopSettingsContext = createContext<{
  settings: DesktopSettings;
  ready: boolean;
  updateSettings: (next: DesktopSettings) => void;
}>({ settings: defaultSettings, ready: false, updateSettings: () => undefined });

function parseSettings(value: string | null): DesktopSettings {
  if (!value) return defaultSettings;
  try {
    const parsed = JSON.parse(value) as Partial<DesktopSettings>;
    const iconOverrides = Object.fromEntries(Object.entries(parsed.iconOverrides || {}).filter(([, icon]) =>
      typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('https://'))));
    const shortcuts = Array.isArray(parsed.shortcuts) ? parsed.shortcuts.filter((shortcut): shortcut is PersonalShortcut =>
        !!shortcut && typeof shortcut.id === 'string' && typeof shortcut.label === 'string' &&
        typeof shortcut.href === 'string' && (shortcut.href.startsWith('/') && !shortcut.href.startsWith('//') || shortcut.href.startsWith('https://') || shortcut.href.startsWith('mailto:')) &&
        typeof shortcut.icon === 'string' && (shortcut.icon.startsWith('/') || shortcut.icon.startsWith('https://'))) : [];
    const wallpaper = typeof parsed.wallpaper === 'string' &&
      (parsed.wallpaper.startsWith('https://') || parsed.wallpaper.startsWith('http://') || parsed.wallpaper.startsWith('data:image/'))
      ? parsed.wallpaper : '';
    return {
      wallpaper,
      iconOverrides,
      shortcuts,
    };
  } catch {
    return defaultSettings;
  }
}

export function DesktopSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DesktopSettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(parseSettings(localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  const updateSettings = (next: DesktopSettings) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo(() => ({ settings, ready, updateSettings }), [settings, ready]);
  return <DesktopSettingsContext.Provider value={value}>{children}</DesktopSettingsContext.Provider>;
}

export function useDesktopSettings() {
  return useContext(DesktopSettingsContext);
}

export const desktopSettingsStorageKey = STORAGE_KEY;
