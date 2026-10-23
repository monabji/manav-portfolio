'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { crystalIcons, desktopApps, desktopLinks, desktopUtilities, type Project } from '@/config/portfolio';
import { useDesktopSettings, type DesktopSettings, type PersonalShortcut } from './desktop-settings';
import { defaultSettings, safeUrl, validateSettings, type Experience } from '@/lib/site-configuration';
import { AeroWindow } from './aero-window';
import { publicPath } from '@/lib/public-path';

const iconChoices = [
  ['Home', crystalIcons.home], ['About', crystalIcons.profile], ['Projects', crystalIcons.projects],
  ['Code', crystalIcons.code], ['Browser', crystalIcons.browser], ['Notepad', crystalIcons.notepad],
  ['Snake', crystalIcons.snake], ['Gallery', crystalIcons.gallery], ['Email', crystalIcons.email],
  ['Music', crystalIcons.music], ['Blender', crystalIcons.blender], ['Graphics', crystalIcons.dashboard],
  ['Game', crystalIcons.gamepad], ['GitHub', publicPath('/brands/github.svg')], ['LinkedIn', publicPath('/brands/linkedin.svg')],
] as const;

function IconPicker({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <div className="dashboard-icon-picker"><img src={value} alt="" /><select aria-label={label} value={value} onChange={event => onChange(event.target.value)}>{!iconChoices.some(([, icon]) => icon === value) && <option value={value}>Custom icon</option>}{iconChoices.map(([name, icon]) => <option key={name} value={icon}>{name}</option>)}</select><input aria-label={`${label} URL`} value={value} onChange={event => onChange(event.target.value)} placeholder="HTTPS image URL or /path" /></div>;
}
function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="dashboard-field"><span>{label}</span>{multiline ? <textarea rows={3} value={value} onChange={event => onChange(event.target.value)} /> : <input value={value} onChange={event => onChange(event.target.value)} />}</label>;
}
function SectionHeading({ icon, title, description }: { icon: string; title: string; description: string }) {
  return <div className="dashboard-section-heading"><img src={icon} alt="" /><div><h2>{title}</h2><p>{description}</p></div></div>;
}
function downloadSettings(settings: DesktopSettings) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'manav-os-backup.json'; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PersonalDashboard() {
  const { settings, ready, revision, error, updateSettings, publish } = useDesktopSettings();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [wallpaperDraft, setWallpaperDraft] = useState('');
  const [shortcutName, setShortcutName] = useState('');
  const [shortcutHref, setShortcutHref] = useState('');
  const [shortcutIcon, setShortcutIcon] = useState<string>(crystalIcons.browser);
  const [shortcutMode, setShortcutMode] = useState<'link' | 'window'>('link');
  const importRef = useRef<HTMLInputElement>(null);
  const saved = useRef('');
  const leaving = useRef(false);
  const [baseline, setBaseline] = useState('');
  useEffect(() => { if (ready && !error) { saved.current = JSON.stringify(settings); setBaseline(saved.current); } }, [ready, revision]);
  const dirty = baseline !== '' && baseline !== JSON.stringify(settings);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { if (!leaving.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const change = (next: DesktopSettings) => { updateSettings(next); setMessage('Draft updated. Click Publish changes to make it live.'); };
  const editableApps = useMemo(() => [
    ...desktopApps.map(app => ({ id: `route:${app.href}`, label: app.label, icon: app.icon })),
    ...desktopUtilities.map(app => ({ id: `app:${app.id}`, label: app.label, icon: app.icon })),
    ...desktopLinks.map(link => ({ id: `link:${link.id}`, label: link.label, icon: link.id === 'email' ? crystalIcons.email : publicPath(`/brands/${link.id}.svg`) })),
  ], []);
  async function save() {
    setBusy(true); setMessage('');
    try { const validated = validateSettings(settings); await publish(validated); setMessage('Published! Your changes are now saved on the live website.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Publishing failed. Your draft is still here.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (dirty && !window.confirm('Discard unpublished changes and sign out?')) return;
    setBusy(true);
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Could not sign out. Please try again.');
      leaving.current = true; saved.current = JSON.stringify(settings); setBaseline(saved.current);
      window.location.replace('/dashboard');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign out.'); setBusy(false); }
  }
  async function loadWallpaper(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > 1500000) { setMessage('Choose an image under 1.5 MB.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/admin/wallpaper', { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      const data = await response.json() as { url: string; error?: string }; if (!response.ok) throw new Error(data.error);
      change({ ...settings, wallpaper: data.url }); setWallpaperDraft('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setBusy(false); }
  }
  async function importSettings(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 500000) throw new Error('Backup is too large. Use image URLs instead of embedded images.');
      const incoming = JSON.parse(await file.text());
      // Legacy browser backups can still import their shortcut/icon fields.
      change(validateSettings({ ...defaultSettings, ...incoming })); setMessage('Backup imported into your draft. Publish to make it live.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not open this backup.'); }
  }
  const updateProject = (kind: 'softwareProjects' | 'designProjects', index: number, patch: Partial<Project>) => change({ ...settings, [kind]: settings[kind].map((item, i) => i === index ? { ...item, ...patch } : item) });
  const updateExperience = (index: number, patch: Partial<Experience>) => change({ ...settings, experience: settings.experience.map((item, i) => i === index ? { ...item, ...patch } : item) });
  const updateApp = (id: string, patch: Partial<PersonalShortcut>) => change({ ...settings, shortcuts: settings.shortcuts.map(item => item.id === id ? { ...item, ...patch } : item) });

  return <main className="route-stage dashboard-stage" id="main-content">
    <AeroWindow title="Manav OS Control Panel" icon={crystalIcons.dashboard} className="content-window dashboard-window" breadcrumbs={[{ label: 'Computer' }, { label: 'Control Panel' }]}>
      <div className="dashboard-body has-scrollbar">
        <header className="dashboard-heading"><div><span className="dashboard-kicker">MANAV OS · ADMINISTRATOR</span><h1>Control Panel</h1><p>Edit your portfolio and desktop. Changes go live only when you publish.</p></div><button type="button" onClick={() => void logout()} disabled={busy}>Sign out</button></header>
        <div className="dashboard-publish-bar"><span>{error || (!ready ? 'Loading live configuration…' : dirty ? 'Unpublished changes' : 'All changes published')}</span><button type="button" disabled={busy || !ready || !!error || !dirty} onClick={() => void save()}>{busy ? 'Please wait…' : 'Publish changes'}</button></div>
        <p className="dashboard-message" role="status" aria-live="polite">{message}</p>
        <fieldset className="dashboard-editor" disabled={busy || !ready || !!error}>
          <section className="dashboard-section">
            <SectionHeading icon={crystalIcons.gallery} title="Wallpaper" description="Use an image URL or upload a PNG, JPEG, WebP, or GIF under 1.5 MB." />
            <div className="dashboard-wallpaper-row"><input aria-label="Wallpaper image URL" placeholder="https://example.com/wallpaper.jpg" value={wallpaperDraft} onChange={event => setWallpaperDraft(event.target.value)} /><button type="button" onClick={() => { if (safeUrl(wallpaperDraft, true)) change({ ...settings, wallpaper: wallpaperDraft }); else setMessage('Use an HTTPS image URL or /path.'); }}>Use URL</button><label className="dashboard-file-button">Choose image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={event => void loadWallpaper(event)} /></label><button type="button" onClick={() => change({ ...settings, wallpaper: '' })}>Default wallpaper</button></div>
            <div className="dashboard-current-wallpaper"><span>Current preview</span><span className="wallpaper-preview" style={settings.wallpaper ? { backgroundImage: `url("${settings.wallpaper.replaceAll('"', '%22')}")` } : undefined} /></div>
          </section>
          <section className="dashboard-section">
            <SectionHeading icon={crystalIcons.projects} title="Desktop icons" description="Choose a Crystal icon or supply your own image URL." />
            <div className="dashboard-icon-list">{editableApps.map(app => <div key={app.id}><strong>{app.label}</strong><IconPicker label={`${app.label} icon`} value={settings.iconOverrides[app.id] || app.icon} onChange={icon => change({ ...settings, iconOverrides: { ...settings.iconOverrides, [app.id]: icon } })} /></div>)}</div>
          </section>
          {(['softwareProjects', 'designProjects'] as const).map(kind => <section key={kind} className="dashboard-section">
            <SectionHeading icon={kind === 'designProjects' ? crystalIcons.blender : crystalIcons.code} title={kind === 'softwareProjects' ? 'Projects' : '3D showcase'} description="Add, edit, or remove projects, with images, tags, repository links, and live website links." />
            <div className="dashboard-records">{settings[kind].map((project, index) => <details key={index}>
              <summary><img src={project.icon} alt="" />{project.title || 'Untitled project'}<small>{project.status}</small></summary>
              <div className="dashboard-record-form"><Field label="Project title" value={project.title} onChange={title => updateProject(kind, index, { title })} /><Field label="Status" value={project.status} onChange={status => updateProject(kind, index, { status })} /><Field label="Description" value={project.description} multiline onChange={description => updateProject(kind, index, { description })} /><Field label="Tags (comma separated)" value={project.tags.join(',')} onChange={value => updateProject(kind, index, { tags: value.split(',') })} /><Field label="Image URL (optional)" value={project.image || ''} onChange={image => updateProject(kind, index, { image })} /><Field label="Image description" value={project.alt || ''} onChange={alt => updateProject(kind, index, { alt })} /><Field label="Category" value={project.category || ''} onChange={category => updateProject(kind, index, { category })} /><IconPicker label="Project icon" value={project.icon} onChange={icon => updateProject(kind, index, { icon })} />
                <div className="dashboard-project-links"><h3>Project links</h3>{project.links.map((link, linkIndex) => <div key={linkIndex}><Field label="Link label" value={link.label} onChange={label => updateProject(kind, index, { links: project.links.map((item, i) => i === linkIndex ? { ...item, label } : item) })} /><Field label="Link URL" value={link.href} onChange={href => updateProject(kind, index, { links: project.links.map((item, i) => i === linkIndex ? { ...item, href } : item) })} /><button type="button" onClick={() => updateProject(kind, index, { links: project.links.filter((_, i) => i !== linkIndex) })}>Remove link</button></div>)}<button type="button" onClick={() => updateProject(kind, index, { links: [...project.links, { label: 'Visit website', href: '' }] })}>Add link</button></div>
                <button type="button" onClick={() => change({ ...settings, [kind]: settings[kind].filter((_, i) => i !== index) })}>Remove project</button>
              </div>
            </details>)}</div>
            <button type="button" onClick={() => change({ ...settings, [kind]: [...settings[kind], { title: 'New project', status: 'In progress', description: '', tags: [], links: [], icon: kind === 'designProjects' ? crystalIcons.blender : crystalIcons.code }] })}>Add {kind === 'designProjects' ? '3D project' : 'project'}</button>
          </section>)}
          <section className="dashboard-section">
            <SectionHeading icon={crystalIcons.profile} title="Experience" description="Manage your roles, organizations, and logos." />
            <div className="dashboard-records">{settings.experience.map((item, index) => <details key={index}><summary><img src={item.logo} alt="" />{item.role || 'New role'}<small>{item.organization}</small></summary><div className="dashboard-record-form"><Field label="Role" value={item.role} onChange={role => updateExperience(index, { role })} /><Field label="Organization" value={item.organization} onChange={organization => updateExperience(index, { organization })} /><Field label="Logo URL" value={item.logo} onChange={logo => updateExperience(index, { logo })} /><Field label="Logo description" value={item.alt} onChange={alt => updateExperience(index, { alt })} /><button type="button" onClick={() => change({ ...settings, experience: settings.experience.filter((_, i) => i !== index) })}>Remove experience</button></div></details>)}</div>
            <button type="button" onClick={() => change({ ...settings, experience: [...settings.experience, { role: 'New role', organization: '', logo: crystalIcons.profile, alt: '' }] })}>Add experience</button>
          </section>
          <section className="dashboard-section">
            <SectionHeading icon={crystalIcons.browser} title="Applications and shortcuts" description="Add a desktop link or an online application that opens inside a Manav OS window." />
            <form className="dashboard-add-shortcut" onSubmit={event => {
              event.preventDefault(); if (!shortcutName.trim() || !safeUrl(shortcutHref) || (shortcutMode === 'window' && !shortcutHref.startsWith('https://'))) { setMessage('Enter a name and a valid URL. Window applications need HTTPS.'); return; }
              change({ ...settings, shortcuts: [...settings.shortcuts, { id: crypto.randomUUID(), label: shortcutName.trim(), href: shortcutHref, icon: shortcutIcon, mode: shortcutMode }] }); setShortcutName(''); setShortcutHref('');
            }}><input aria-label="Application name" placeholder="Application name" value={shortcutName} onChange={event => setShortcutName(event.target.value)} required /><input aria-label="Application URL" placeholder="https:// or mailto:" value={shortcutHref} onChange={event => setShortcutHref(event.target.value)} required /><select aria-label="Application mode" value={shortcutMode} onChange={event => setShortcutMode(event.target.value as 'link' | 'window')}><option value="link">Open link</option><option value="window">Open in OS window</option></select><select aria-label="Application icon" value={shortcutIcon} onChange={event => setShortcutIcon(event.target.value)}>{iconChoices.map(([label, icon]) => <option key={label} value={icon}>{label}</option>)}</select><button type="submit">Add application</button></form>
            <div className="dashboard-records">{settings.shortcuts.map(app => <details key={app.id}><summary><img src={app.icon} alt="" />{app.label}<small>{app.mode === 'window' ? 'OS window' : 'Link'}</small></summary><div className="dashboard-record-form"><Field label="Application name" value={app.label} onChange={label => updateApp(app.id, { label })} /><Field label="Application URL" value={app.href} onChange={href => updateApp(app.id, { href })} /><label className="dashboard-field"><span>Open behavior</span><select value={app.mode || 'link'} onChange={event => updateApp(app.id, { mode: event.target.value as 'link' | 'window' })}><option value="link">Open link</option><option value="window">Open in OS window</option></select></label><IconPicker label="Application icon" value={app.icon} onChange={icon => updateApp(app.id, { icon })} /><button type="button" onClick={() => change({ ...settings, shortcuts: settings.shortcuts.filter(item => item.id !== app.id) })}>Remove application</button></div></details>)}</div>
            <p>Embedding depends on the application's provider. Each window also includes an “Open in a new tab” fallback.</p>
          </section>
          <section className="dashboard-section dashboard-transfer"><div><h2>Backup and restore</h2><p>Export the complete configuration, or import a backup into your draft.</p></div><div className="dashboard-transfer-actions"><button type="button" onClick={() => downloadSettings(settings)}>Export JSON</button><button type="button" onClick={() => importRef.current?.click()}>Import JSON</button><button type="button" onClick={() => { if (window.confirm('Reset the draft to the original portfolio? Nothing goes live until you publish.')) change(structuredClone(defaultSettings)); }}>Reset draft</button><input ref={importRef} type="file" accept="application/json,.json" onChange={event => void importSettings(event)} /></div></section>
        </fieldset>
      </div>
      <footer className="window-status"><span>Administrator · session expires after 8 hours</span><span>Revision {revision}</span></footer>
    </AeroWindow>
  </main>;
}
