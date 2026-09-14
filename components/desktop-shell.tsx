'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const apps = [
  { href: '/', label: 'Home', icon: '/aero/home.png' },
  { href: '/about', label: 'About me', icon: '/aero/profile.png' },
  { href: '/projects', label: 'My projects', icon: '/aero/games.png' },
];

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

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [clock, setClock] = useState('');
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
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('manav-sound', next ? 'on' : 'off');
    if (next) playTone('open');
  };

  return (
    <div className="aero-desktop">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="wallpaper" aria-hidden="true" />
      <div className="bubble-field" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>

      <aside className="desktop-icons" aria-label="Desktop shortcuts">
        {apps.slice(1).map((app) => (
          <a href={app.href} key={app.href} onClick={() => soundOn && playTone('open')}>
            <img src={app.icon} alt="" />
            <span>{app.label}</span>
          </a>
        ))}
      </aside>

      <div className="desktop-workspace">{children}</div>

      <div className={`start-menu ${menuOpen ? 'is-open' : ''}`} ref={menuRef} aria-hidden={!menuOpen}>
        <div className="start-user">
          <img src="/aero/profile.png" alt="" />
          <div><strong>Manav</strong><span>VIT Vellore</span></div>
        </div>
        <nav aria-label="Start menu">
          {apps.map((app) => (
            <a href={app.href} key={app.href} tabIndex={menuOpen ? 0 : -1}>
              <img src={app.icon} alt="" />
              <span><strong>{app.label}</strong><small>{app.href === '/' ? 'Welcome screen' : app.href === '/about' ? 'Education, skills and experience' : 'Code, games and 3D work'}</small></span>
            </a>
          ))}
        </nav>
        <div className="start-foot">Manav OS <a href="/asset-credits.txt" target="_blank">asset credits</a></div>
      </div>

      <footer className="taskbar">
        <button className={`start-button ${menuOpen ? 'is-active' : ''}`} type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close start menu' : 'Open start menu'} onClick={() => { setMenuOpen((open) => !open); if (soundOn) playTone('select'); }}>
          <span className="start-orb"><span /><span /><span /><span /></span>
          <b>start</b>
          <span className="sr-only">{menuOpen ? 'Close start menu' : 'Open start menu'}</span>
        </button>
        <nav className="taskbar-apps" aria-label="Open portfolio pages">
          {apps.map((app) => (
            <a href={app.href} key={app.href} aria-label={app.label} className={pathname === app.href ? 'is-active' : ''} aria-current={pathname === app.href ? 'page' : undefined} onClick={() => soundOn && playTone('select')}>
              <img src={app.icon} alt="" /><span>{app.label}</span>
            </a>
          ))}
        </nav>
        <div className="tray">
          <button type="button" onClick={toggleSound} aria-pressed={soundOn} title={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}>
            <img src="/aero/sound.png" alt="" /><span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
          <time>{clock}</time>
        </div>
      </footer>
    </div>
  );
}
