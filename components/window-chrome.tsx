'use client';

import { useEffect, useId, useState, type HTMLAttributes } from 'react';
import { workspaceApps, desktopUtilities } from '@/config/portfolio';
import { useDesktopSettings } from './desktop-settings';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

// One source of truth for Explorer chrome; application icons remain Crystal.
export const explorerIcons = Object.fromEntries(['libraries', 'documents', 'pictures', 'music', 'computer', 'favorites', 'desktop', 'folder', 'help'].map(name => [name, `/win7/selected/${name}-16.png`])) as Record<string, string>;
export type Breadcrumb = { label: string; href?: string; onClick?: () => void };

export function WindowTitlebar({ title, icon, maximized = false, onMinimize, onMaximize, onClose, ...props }: HTMLAttributes<HTMLElement> & {
  title: string; icon: string; maximized?: boolean; onMinimize?: () => void; onMaximize?: () => void; onClose: () => void;
}) {
  return <header {...props} className={`title-bar window-titlebar ${props.className || ''}`}>
    <div className="title-bar-text window-title"><img src={icon} alt="" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/crystal/projects.png'; }} /><span>{title}</span></div>
    <div className="title-bar-controls window-controls" aria-label={`${title} window controls`} onDoubleClick={event => event.stopPropagation()}>
      {onMinimize && <button type="button" className="is-minimize" aria-label={`Minimize ${title}`} title="Minimize" onClick={onMinimize} />}
      {onMaximize && <button type="button" className={maximized ? 'is-restore' : 'is-maximize'} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`} title={maximized ? 'Restore' : 'Maximize'} onClick={onMaximize} />}
      <button type="button" className="is-close" aria-label={`Close ${title}`} title="Close" onClick={onClose} />
    </div>
  </header>;
}

type Command = { label: string; action: () => void; icon?: string };
function Menu({ label, items, arrow = false, icon }: { label: string; items: Command[]; arrow?: boolean; icon?: string }) {
  return <DropdownMenu><DropdownMenuTrigger className="explorer-menu-button">{icon && <img src={icon} alt="" />}{label}{arrow && <i className="menu-arrow" />}</DropdownMenuTrigger>
    <DropdownMenuContent className="explorer-popup" sideOffset={0}>{items.map((item, index) => <DropdownMenuItem key={`${item.label}-${index}`} className="explorer-menu-item" onClick={item.action}>{item.icon && <img src={item.icon} alt="" />}{item.label}</DropdownMenuItem>)}</DropdownMenuContent>
  </DropdownMenu>;
}

function openUtility(id: string) { window.dispatchEvent(new CustomEvent('manav:open-utility', { detail: id })); }
const go = (href: string) => { window.location.assign(href); };

export function ExplorerChrome({ title, icon, breadcrumbs, onToggleSidebar }: { title: string; icon?: string; breadcrumbs?: Breadcrumb[]; onToggleSidebar?: () => void }) {
  const { settings: { softwareProjects, designProjects, shortcuts } } = useDesktopSettings();
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [help, setHelp] = useState(false);
  const searchId = useId();
  // Navigation entries survive full page loads. The destination detects whether
  // it was reached by back/forward and moves the cursor instead of adding a duplicate.
  useEffect(() => {
    try {
      const current = window.location.pathname;
      const saved = JSON.parse(sessionStorage.getItem('manav-navigation') || '{"paths":[],"index":-1}') as { paths: string[]; index: number; pending?: number };
      if (saved.pending !== undefined && saved.paths[saved.pending] === current) saved.index = saved.pending;
      else if (saved.paths[saved.index] !== current) { saved.paths = saved.paths.slice(0, saved.index + 1); saved.paths.push(current); saved.index = saved.paths.length - 1; }
      delete saved.pending;
      sessionStorage.setItem('manav-navigation', JSON.stringify(saved));
      setCanGoBack(saved.index > 0); setCanGoForward(saved.index < saved.paths.length - 1);
    } catch { setCanGoBack(history.length > 1); }
  }, []);
  const navigateHistory = (direction: number) => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('manav-navigation') || '{}');
      const next = saved.index + direction;
      if (saved.paths?.[next]) { saved.pending = next; sessionStorage.setItem('manav-navigation', JSON.stringify(saved)); go(saved.paths[next]); }
    } catch { direction < 0 ? history.back() : history.forward(); }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setNotice('Link copied'); } catch { setNotice('Copy the link from your browser address bar.'); }
    window.setTimeout(() => setNotice(''), 4000);
  };
  const appCommands: Command[] = [...workspaceApps.map(app => ({ label: app.label, icon: app.icon, action: () => go(app.href) })), ...desktopUtilities.map(app => ({ label: app.label, icon: app.icon, action: () => openUtility(app.id) })), ...shortcuts.map(app => ({ label: app.label, icon: app.icon, action: () => app.mode === 'window' ? openUtility(app.id) : go(app.href) }))];
  const catalog = [...appCommands, ...[...softwareProjects, ...designProjects].map(project => ({ label: project.title, icon: project.icon, action: () => go(`/projects?project=${encodeURIComponent(project.title.toLowerCase().replaceAll(' ', '-'))}`) }))];
  const results = query.trim() ? catalog.filter(item => item.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7) : [];
  const trail = breadcrumbs || [{ label: title }];
  return <div className="explorer-chrome">
    <div className="explorer-navigation">
      <div className="explorer-history"><button className="navigation-circle" type="button" aria-label="Back" title="Back" disabled={!canGoBack} onClick={() => navigateHistory(-1)}><span>←</span></button><button className="navigation-circle" type="button" aria-label="Forward" title="Forward" disabled={!canGoForward} onClick={() => navigateHistory(1)}><span>→</span></button><Menu label="" arrow items={workspaceApps.map(app => ({ label: app.label, action: () => go(app.href) }))} /></div>
      <nav className="explorer-address" aria-label="Breadcrumb"><img src={icon || explorerIcons.libraries} alt="" /><a href="/">Manav OS</a>{trail.map((part, index) => <span className="breadcrumb-part" key={`${part.label}-${index}`}><b>›</b>{part.href ? <a href={part.href}>{part.label}</a> : part.onClick ? <button type="button" onClick={part.onClick}>{part.label}</button> : <span>{part.label}</span>}</span>)}<span className="address-spacer" /><Menu label="" arrow items={appCommands} /><button className="explorer-refresh" type="button" aria-label="Refresh window" title="Refresh" onClick={() => window.location.reload()}>↻</button></nav>
      <div className="explorer-search"><form onSubmit={event => { event.preventDefault(); if (results[0]) results[0].action(); }}><input id={searchId} aria-label={`Search ${title}`} type="search" placeholder={`Search ${title}`} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setQuery(''); }} /><button type="submit" aria-label="Search"><span className="search-symbol" /></button></form>{query && <div className="explorer-search-results">{results.length ? results.map(item => <button key={item.label} type="button" onClick={() => { setQuery(''); item.action(); }}><img src={item.icon} alt="" />{item.label}</button>) : <p>No matching items</p>}</div>}</div>
    </div>
    <nav className="explorer-menubar" aria-label={`${title} menu`}>
      <Menu label="File" items={appCommands} />
      <Menu label="Edit" items={[{ label: 'Copy page link', action: () => void copyLink() }, { label: 'Open Notepad', action: () => openUtility('notepad') }]} />
      <Menu label="View" items={[...(onToggleSidebar ? [{ label: 'Show / hide navigation pane', action: onToggleSidebar }] : []), { label: 'Refresh', action: () => window.location.reload() }, { label: 'Pictures library', action: () => openUtility('gallery') }]} />
      <Menu label="Tools" items={[{ label: 'Music player', action: () => openUtility('music') }]} />
      <Menu label="Help" items={[{ label: 'Using Manav OS', action: () => setHelp(value => !value) }, { label: 'Asset credits', action: () => window.open('/asset-credits.txt', '_blank', 'noopener,noreferrer') }]} />
    </nav>
    <div className="explorer-library-band"><span><img src={icon || explorerIcons.libraries} alt="" />{title}</span></div>
    <nav className="explorer-commandbar" aria-label={`${title} commands`}>
      <Menu label="Organize" arrow items={[{ label: 'Copy page link', action: () => void copyLink() }, ...(onToggleSidebar ? [{ label: 'Navigation pane', action: onToggleSidebar }] : [])]} />
      <Menu label="Open" icon={explorerIcons.folder} items={appCommands} />
      <Menu label="Share with" arrow items={[{ label: 'Copy link', action: () => void copyLink() }, { label: 'Email link', action: () => go(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}`) }]} />
      <span className="command-spacer" />
      {onToggleSidebar && <button className="explorer-menu-button pane-toggle" type="button" aria-label="Toggle navigation pane" title="Navigation pane" onClick={onToggleSidebar}><span /></button>}
      <button className="explorer-menu-button" type="button" aria-label="Window help" title="Help" onClick={() => setHelp(value => !value)}><img src={explorerIcons.help} alt="" /></button>
    </nav>
    {help && <div className="explorer-help"><strong>Welcome to Manav OS</strong><p>Open a desktop shortcut, or use File and Open to choose an app. Search finds pages, apps, and projects. Drag app title bars to move them; use the top-right controls to minimize, maximize, or close.</p><button type="button" onClick={() => setHelp(false)}>Got it</button></div>}
    {notice && <div className="explorer-notice" role="status">{notice}</div>}
  </div>;
}

export function ExplorerSidebar({ children }: { children?: React.ReactNode }) {
  return <aside className="native-sidebar has-scrollbar" aria-label="Navigation pane"><strong><img src={explorerIcons.favorites} alt="" />Favorites</strong><a href="/"><img src={explorerIcons.desktop} alt="" />Desktop</a><a href="/about"><img src={explorerIcons.documents} alt="" />About me</a><a href="/projects"><img src={explorerIcons.folder} alt="" />Projects</a><strong><img src={explorerIcons.libraries} alt="" />Libraries</strong><button type="button" onClick={() => openUtility('gallery')}><img src={explorerIcons.pictures} alt="" />Pictures</button><button type="button" onClick={() => openUtility('music')}><img src={explorerIcons.music} alt="" />Music</button>{children}</aside>;
}
