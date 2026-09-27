'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { crystalIcons, desktopApps, desktopLinks, desktopUtilities, type DesktopUtilityId } from '@/config/portfolio';
import { DesktopUtilityWindow } from './desktop-utility-window';
import { useDesktopSettings } from './desktop-settings';

type UtilityState = { open: boolean; minimized: boolean; maximized: boolean; zIndex: number };
type UtilityStates = Record<DesktopUtilityId, UtilityState>;

const initialUtilities = Object.fromEntries(desktopUtilities.map(({ id }) => [id, {
  open: false, minimized: false, maximized: false, zIndex: 0,
}])) as UtilityStates;

function playTone(kind: 'open' | 'close' | 'select') {
  const AudioContextClass = window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const frequencies = kind === 'open' ? [440, 660] : kind === 'close' ? [420, 260] : [560, 720];
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequencies[0], now);
  oscillator.frequency.exponentialRampToValueAtTime(frequencies[1], now + 0.09);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.07, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.14);
  oscillator.addEventListener('ended', () => void ctx.close());
}

export function useAeroSound() {
  return (kind: 'open' | 'close' | 'select' = 'select') => {
    if (typeof window !== 'undefined' && localStorage.getItem('manav-sound') === 'on') playTone(kind);
  };
}

function BrandIcon({ brand, icon }: { brand: (typeof desktopLinks)[number]['id']; icon?: string }) {
  if (icon) return <span className={`desktop-brand desktop-brand-${brand}`} aria-hidden="true"><img src={icon} alt="" /></span>;
  if (brand === 'email') return <span className="desktop-brand desktop-brand-email" aria-hidden="true"><img src={crystalIcons.email} alt="" /></span>;
  return <span className={`desktop-brand desktop-brand-${brand}`} aria-hidden="true">
    <img src={`/brands/${brand}.svg`} alt="" />
  </span>;
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useDesktopSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [clock, setClock] = useState('');
  const [utilities, setUtilities] = useState<UtilityStates>(initialUtilities);
  const zCounter = useRef(90);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSoundOn(localStorage.getItem('manav-sound') === 'on');
    const updateClock = () => setClock(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !(event.target as Element).closest('.start-button')) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, []);

  const changeUtility = (id: DesktopUtilityId, patch: Partial<UtilityState>) => {
    setUtilities((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  };
  const openUtility = (id: DesktopUtilityId) => {
    zCounter.current += 1;
    changeUtility(id, { open: true, minimized: false, zIndex: zCounter.current });
    setMenuOpen(false);
    if (soundOn) playTone('open');
  };
  const focusUtility = (id: DesktopUtilityId) => {
    zCounter.current += 1;
    changeUtility(id, { zIndex: zCounter.current });
  };
  const closeUtility = (id: DesktopUtilityId) => { changeUtility(id, { open: false }); if (soundOn) playTone('close'); };
  const minimizeUtility = (id: DesktopUtilityId) => { changeUtility(id, { minimized: true }); if (soundOn) playTone('close'); };
  const maximizeUtility = (id: DesktopUtilityId) => { changeUtility(id, { maximized: !utilities[id].maximized }); if (soundOn) playTone('select'); };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('manav-sound', next ? 'on' : 'off');
    if (next) playTone('open');
  };
  const showDesktop = () => {
    setMenuOpen(false);
    setUtilities((current) => Object.fromEntries(Object.entries(current).map(([id, state]) => [id, { ...state, minimized: true }])) as UtilityStates);
    window.dispatchEvent(new Event('manav:minimize-route'));
    if (soundOn) playTone('select');
  };
  const onRouteClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === href) {
      event.preventDefault();
      window.dispatchEvent(new Event('manav:restore-route'));
    }
    setMenuOpen(false);
    if (soundOn) playTone('select');
  };

  return <div className="aero-desktop">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="wallpaper" aria-hidden="true" style={settings.wallpaper ? { backgroundImage: `url("${settings.wallpaper.replaceAll('"', '%22')}")` } : undefined} />
    <div className="bubble-field" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div>

    <aside className="desktop-icons" aria-label="Desktop shortcuts">
      {desktopApps.slice(1).map((app) => <a href={app.href} key={app.href} title={app.description} onClick={(event) => onRouteClick(event, app.href)}><img src={settings.iconOverrides[`route:${app.href}`] || app.icon} alt="" /><span>{app.label}</span></a>)}
      {desktopUtilities.map((app) => <button type="button" key={app.id} title={app.description} onClick={() => openUtility(app.id)}><img src={settings.iconOverrides[`app:${app.id}`] || app.icon} alt="" /><span>{app.label}</span></button>)}
      {desktopLinks.map((link) => <a href={link.href} key={link.id} title={link.description} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}><BrandIcon brand={link.id} icon={settings.iconOverrides[`link:${link.id}`]} /><span>{link.label}</span></a>)}
      {settings.shortcuts.map((link) => <a href={link.href} key={link.id} title={link.href} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}><img src={link.icon} alt="" /><span>{link.label}</span></a>)}
    </aside>

    <div className="desktop-workspace">{children}</div>
    {desktopUtilities.map((app) => <DesktopUtilityWindow
      key={app.id} id={app.id} title={app.label} icon={settings.iconOverrides[`app:${app.id}`] || app.icon} state={utilities[app.id]}
      onClose={() => closeUtility(app.id)} onMinimize={() => minimizeUtility(app.id)}
      onMaximize={() => maximizeUtility(app.id)} onFocus={() => focusUtility(app.id)}
    />)}

    <div className={`start-menu ${menuOpen ? 'is-open' : ''}`} ref={menuRef} aria-hidden={!menuOpen}>
      <div className="start-user"><img src={crystalIcons.profile} alt="" /><div><strong>Manav</strong><span>VIT Vellore</span></div></div>
      <nav aria-label="Start menu">
        {desktopApps.map((app) => <a href={app.href} key={app.href} tabIndex={menuOpen ? 0 : -1} onClick={(event) => onRouteClick(event, app.href)}><img src={settings.iconOverrides[`route:${app.href}`] || app.icon} alt="" /><span><strong>{app.label}</strong><small>{app.description}</small></span></a>)}
        {desktopUtilities.map((app) => <button key={app.id} type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openUtility(app.id)}><img src={settings.iconOverrides[`app:${app.id}`] || app.icon} alt="" /><span><strong>{app.label}</strong><small>{app.description}</small></span></button>)}
        {desktopLinks.map((link) => <a href={link.href} key={link.id} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noreferrer' : undefined} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}><BrandIcon brand={link.id} icon={settings.iconOverrides[`link:${link.id}`]} /><span><strong>{link.label}</strong><small>{link.description}</small></span></a>)}
        {settings.shortcuts.map((link) => <a href={link.href} key={link.id} target={link.href.startsWith('https:') ? '_blank' : undefined} rel={link.href.startsWith('https:') ? 'noreferrer' : undefined} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}><img src={link.icon} alt="" /><span><strong>{link.label}</strong><small>{link.href}</small></span></a>)}
      </nav>
      <div className="start-foot"><span>Manav OS</span><a href="/asset-credits.txt" target="_blank" rel="noreferrer">Asset credits</a></div>
    </div>

    <footer className="taskbar">
      <button className={`start-button ${menuOpen ? 'is-active' : ''}`} type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close start menu' : 'Open start menu'} onClick={() => { setMenuOpen((open) => !open); if (soundOn) playTone('select'); }}><span className="start-orb" aria-hidden="true"><span /><span /><span /><span /></span></button>
      <nav className="taskbar-apps" aria-label="Portfolio and apps">
        {desktopApps.map((app) => <a href={app.href} key={app.href} title={app.label} aria-label={app.label} className={pathname === app.href ? 'is-active' : ''} aria-current={pathname === app.href ? 'page' : undefined} onClick={(event) => onRouteClick(event, app.href)}><img src={settings.iconOverrides[`route:${app.href}`] || app.icon} alt="" /><span>{app.label}</span></a>)}
        {desktopUtilities.map((app) => <button key={app.id} type="button" title={app.label} aria-label={`Open ${app.label}`} className={utilities[app.id].open && !utilities[app.id].minimized ? 'is-active' : ''} onClick={() => openUtility(app.id)}><img src={settings.iconOverrides[`app:${app.id}`] || app.icon} alt="" /><span>{app.label}</span></button>)}
      </nav>
      <div className="tray"><button type="button" onClick={toggleSound} aria-pressed={soundOn} title={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}><img src={crystalIcons.sound} alt="" /><span>{soundOn ? 'Sound on' : 'Sound off'}</span></button><time>{clock}</time></div>
      <button type="button" className="show-desktop" onClick={showDesktop} title="Show desktop" aria-label="Show desktop" />
    </footer>
  </div>;
}
