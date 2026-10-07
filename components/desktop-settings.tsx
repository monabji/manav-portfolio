'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultSettings, type DesktopSettings } from '@/lib/site-configuration';
export type { DesktopSettings, PersonalShortcut } from '@/lib/site-configuration';
const DesktopSettingsContext = createContext<{
  settings: DesktopSettings; ready: boolean; revision: number; error: string;
  updateSettings: (next: DesktopSettings) => void;
  publish: (next: DesktopSettings) => Promise<void>;
}>({ settings: defaultSettings, ready: false, revision: 0, error: '', updateSettings: () => undefined, publish: async () => undefined });

export function DesktopSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DesktopSettings>(defaultSettings);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/site-config', { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json() as { settings: DesktopSettings; revision: number; error?: string };
      if (!response.ok) throw new Error(data.error);
      setSettings(data.settings); setRevision(data.revision); setError('');
    }).catch(error => { if (error.name !== 'AbortError') setError('Could not load live settings. Reload before editing.'); }).finally(() => setReady(true));
    return () => controller.abort();
  }, []);

  const publish = async (next: DesktopSettings) => {
    const response = await fetch('/api/admin/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: next, revision }) });
    const data = await response.json() as { settings: DesktopSettings; revision: number; error?: string };
    if (!response.ok) throw new Error(data.error || 'Could not publish changes.');
    setSettings(data.settings); setRevision(data.revision); setError('');
  };

  const value = useMemo(() => ({ settings, ready, revision, error, updateSettings: setSettings, publish }), [settings, ready, revision, error]);
  return <DesktopSettingsContext.Provider value={value}>{children}</DesktopSettingsContext.Provider>;
}

export function useDesktopSettings() {
  return useContext(DesktopSettingsContext);
}
