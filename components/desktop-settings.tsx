'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSettings, type DesktopSettings } from '@/lib/site-configuration';
export type { DesktopSettings } from '@/lib/site-configuration';
const DesktopSettingsContext = createContext<{
  settings: DesktopSettings; ready: boolean;
}>({ settings: defaultSettings, ready: false });

export function DesktopSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DesktopSettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      setReady(true);
      return;
    }
    const controller = new AbortController();
    fetch('/api/site-config', { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json() as { settings: DesktopSettings; revision: number };
      if (!response.ok) throw new Error('Site settings are unavailable.');
      setSettings(data.settings);
    }).catch(error => { if (error.name !== 'AbortError') console.error('Could not load live site settings.'); }).finally(() => setReady(true));
    return () => controller.abort();
  }, []);

  const value = useMemo(() => ({ settings, ready }), [settings, ready]);
  return <DesktopSettingsContext.Provider value={value}>{children}</DesktopSettingsContext.Provider>;
}

export function useDesktopSettings() {
  return useContext(DesktopSettingsContext);
}
