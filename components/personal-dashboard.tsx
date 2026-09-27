'use client';

import { useMemo, useRef, useState } from 'react';
import { crystalIcons, desktopApps, desktopLinks, desktopUtilities } from '@/config/portfolio';
import { useDesktopSettings, type DesktopSettings, type PersonalShortcut } from './desktop-settings';

const iconChoices = [
  ['Home', crystalIcons.home], ['About', crystalIcons.profile], ['Projects', crystalIcons.projects],
  ['Code', crystalIcons.code], ['Browser', crystalIcons.browser], ['Notepad', crystalIcons.notepad],
  ['Snake', crystalIcons.snake], ['Gallery', crystalIcons.gallery], ['Email', crystalIcons.email],
  ['Music', crystalIcons.music], ['Blender', crystalIcons.blender], ['Graphics', crystalIcons.dashboard],
] as const;

function isSafeWallpaper(value: string) {
  if (value.startsWith('data:image/')) return true;
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}

function isSafeShortcutHref(value: string) {
  if (value.startsWith('/')) return !value.startsWith('//');
  try { return ['https:', 'mailto:'].includes(new URL(value).protocol); } catch { return false; }
}

function downloadSettings(settings: DesktopSettings) {
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'manav-desktop-settings.json';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PersonalDashboard() {
  const { settings, ready, updateSettings } = useDesktopSettings();
  const [wallpaperDraft, setWallpaperDraft] = useState('');
  const [shortcutName, setShortcutName] = useState('');
  const [shortcutHref, setShortcutHref] = useState('');
  const [shortcutIcon, setShortcutIcon] = useState<string>(crystalIcons.browser);
  const [iconUrlDrafts, setIconUrlDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const importRef = useRef<HTMLInputElement>(null);

  const editableApps = useMemo(() => [
    ...desktopApps.map((app) => ({ id: `route:${app.href}`, label: app.label, icon: app.icon })),
    ...desktopUtilities.map((app) => ({ id: `app:${app.id}`, label: app.label, icon: app.icon })),
    ...desktopLinks.map((link) => ({ id: `link:${link.id}`, label: link.label, icon: link.id === 'email' ? crystalIcons.email : `/brands/${link.id}.svg` })),
  ], []);

  const saveIcon = (id: string, icon: string) => {
    updateSettings({ ...settings, iconOverrides: { ...settings.iconOverrides, [id]: icon } });
    setMessage('Icon updated on this device.');
  };

  const saveIconUrl = (id: string) => {
    const icon = (iconUrlDrafts[id] || '').trim();
    if (!(icon.startsWith('/') && !icon.startsWith('//')) && !icon.startsWith('https://')) {
      setMessage('Use an HTTPS image URL or a path within this website.');
      return;
    }
    saveIcon(id, icon);
  };

  const applyWallpaper = () => {
    const wallpaper = wallpaperDraft.trim();
    if (!isSafeWallpaper(wallpaper)) { setMessage('Enter an image URL beginning with https:// or upload an image.'); return; }
    updateSettings({ ...settings, wallpaper });
    setMessage('Wallpaper preview saved on this device.');
  };

  const loadWallpaper = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setMessage('Choose an image file.'); return; }
    if (file.size > 1_500_000) { setMessage('Choose an image under 1.5 MB to fit browser storage.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const wallpaper = String(reader.result || '');
      updateSettings({ ...settings, wallpaper });
      setWallpaperDraft('');
      setMessage('Wallpaper preview saved on this device.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const addShortcut = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = shortcutName.trim();
    const href = shortcutHref.trim();
    if (!label || !isSafeShortcutHref(href)) { setMessage('Use a name and a valid https://, mailto:, or local page link.'); return; }
    const shortcut: PersonalShortcut = { id: crypto.randomUUID(), label, href, icon: shortcutIcon };
    updateSettings({ ...settings, shortcuts: [...settings.shortcuts, shortcut] });
    setShortcutName('');
    setShortcutHref('');
    setMessage('Shortcut added to this device.');
  };

  const importSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const incoming = JSON.parse(await file.text()) as Partial<DesktopSettings>;
      const iconOverrides = Object.fromEntries(Object.entries(incoming.iconOverrides || {}).filter(([, icon]) => typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('https://'))));
      const shortcuts = Array.isArray(incoming.shortcuts) ? incoming.shortcuts.filter((shortcut): shortcut is PersonalShortcut =>
        !!shortcut && typeof shortcut.id === 'string' && typeof shortcut.label === 'string' &&
        typeof shortcut.href === 'string' && isSafeShortcutHref(shortcut.href) && typeof shortcut.icon === 'string' &&
        (shortcut.icon.startsWith('/') || shortcut.icon.startsWith('https://'))) : [];
      const wallpaper = typeof incoming.wallpaper === 'string' && isSafeWallpaper(incoming.wallpaper) ? incoming.wallpaper : '';
      updateSettings({ wallpaper, iconOverrides, shortcuts });
      setWallpaperDraft(wallpaper.startsWith('http') ? wallpaper : '');
      setMessage('Settings imported and saved on this device.');
    } catch {
      setMessage('That settings file could not be opened.');
    }
    event.target.value = '';
  };

  const resetSettings = () => {
    updateSettings({ wallpaper: '', iconOverrides: {}, shortcuts: [] });
    setWallpaperDraft('');
    setMessage('Desktop settings reset to the original design.');
  };

  return <main className="route-stage dashboard-stage" id="main-content">
    <section className="aero-window content-window dashboard-window" aria-labelledby="dashboard-title">
      <header className="window-titlebar"><div className="window-title"><img src={crystalIcons.dashboard} alt="" /><span>Personal Desktop Settings</span></div><div className="window-controls" aria-label="Dashboard window controls"><a href="/" aria-label="Close dashboard" title="Close">×</a></div></header>
      <nav className="window-menubar" aria-label="Dashboard navigation"><a href="/">Desktop</a><a href="/about">About</a><a href="/projects">Projects</a></nav>
      <div className="dashboard-body">
        <header className="dashboard-heading"><div><span className="dashboard-kicker">MANAV OS · PERSONAL</span><h1 id="dashboard-title">Desktop settings</h1><p>Change the wallpaper, shortcut icons, and links on your desktop.</p></div><span className="dashboard-badge">{ready ? 'Ready' : 'Loading'}</span></header>
        <section className="dashboard-section" aria-labelledby="wallpaper-heading">
          <div className="dashboard-section-heading"><img src={crystalIcons.gallery} alt="" /><div><h2 id="wallpaper-heading">Wallpaper</h2><p>Choose a web image or upload one for this browser.</p></div></div>
          <div className="dashboard-wallpaper-row"><input aria-label="Wallpaper image URL" type="url" placeholder="https://example.com/wallpaper.jpg" value={wallpaperDraft} onChange={(event) => setWallpaperDraft(event.target.value)} /><button type="button" onClick={applyWallpaper}>Use URL</button><label className="dashboard-file-button">Choose image<input type="file" accept="image/*" onChange={loadWallpaper} /></label></div>
          <div className="dashboard-current-wallpaper"><span>Current preview</span><span className="wallpaper-preview" style={settings.wallpaper ? { backgroundImage: `url("${settings.wallpaper.replaceAll('"', '%22')}")` } : undefined} /></div>
        </section>
        <section className="dashboard-section" aria-labelledby="icons-heading">
          <div className="dashboard-section-heading"><img src={crystalIcons.projects} alt="" /><div><h2 id="icons-heading">Shortcut icons</h2><p>Choose an icon for each built-in desktop shortcut.</p></div></div>
          <div className="dashboard-icon-list">{editableApps.map((app) => <div key={app.id}><span><img src={settings.iconOverrides[app.id] || app.icon} alt="" />{app.label}</span><select aria-label={`${app.label} icon`} value={settings.iconOverrides[app.id] || app.icon} onChange={(event) => saveIcon(app.id, event.target.value)}>{iconChoices.map(([label, icon]) => <option key={`${app.id}-${icon}`} value={icon}>{label}</option>)}</select><span className="dashboard-icon-custom"><input aria-label={`${app.label} custom icon URL`} type="url" placeholder="Custom HTTPS icon URL" value={iconUrlDrafts[app.id] || ''} onChange={(event) => setIconUrlDrafts((current) => ({ ...current, [app.id]: event.target.value }))} /><button type="button" onClick={() => saveIconUrl(app.id)}>Use</button></span></div>)}</div>
        </section>
        <section className="dashboard-section" aria-labelledby="shortcuts-heading">
          <div className="dashboard-section-heading"><img src={crystalIcons.browser} alt="" /><div><h2 id="shortcuts-heading">Your shortcuts</h2><p>Add links that appear on the desktop and in Start.</p></div></div>
          <form className="dashboard-add-shortcut" onSubmit={addShortcut}><input aria-label="Shortcut name" placeholder="Shortcut name" value={shortcutName} onChange={(event) => setShortcutName(event.target.value)} /><input aria-label="Shortcut URL" placeholder="https:// or mailto:" value={shortcutHref} onChange={(event) => setShortcutHref(event.target.value)} /><select aria-label="Shortcut icon" value={shortcutIcon} onChange={(event) => setShortcutIcon(event.target.value)}>{iconChoices.map(([label, icon]) => <option key={icon} value={icon}>{label} icon</option>)}</select><button type="submit">Add shortcut</button></form>
          {settings.shortcuts.length > 0 && <ul className="dashboard-shortcuts-list">{settings.shortcuts.map((shortcut) => <li key={shortcut.id}><span><img src={shortcut.icon} alt="" />{shortcut.label}<small>{shortcut.href}</small></span><button type="button" aria-label={`Remove ${shortcut.label}`} onClick={() => updateSettings({ ...settings, shortcuts: settings.shortcuts.filter((item) => item.id !== shortcut.id) })}>Remove</button></li>)}</ul>}
        </section>
        <section className="dashboard-section dashboard-transfer" aria-label="Settings backup">
          <div><h2>Back up settings</h2><p>Export or import a desktop settings file.</p></div>
          <div className="dashboard-transfer-actions"><button type="button" onClick={() => downloadSettings(settings)}>Export JSON</button><button type="button" onClick={() => importRef.current?.click()}>Import JSON</button><button type="button" className="dashboard-reset" onClick={resetSettings}>Reset</button><input ref={importRef} type="file" accept="application/json,.json" onChange={importSettings} /></div>
        </section>
        <aside className="dashboard-publish-note"><strong>Live publishing is not connected yet.</strong><span>This editor saves a personal draft in this browser. The hosted site has no writable settings store connected, so these changes will not appear for other visitors yet.</span></aside>
        <p className="dashboard-message" role="status" aria-live="polite">{message || 'Saved automatically on this device.'}</p>
      </div>
      <footer className="window-status"><span>Personal Desktop Settings</span><span>Settings saved on this device</span></footer>
    </section>
  </main>;
}
