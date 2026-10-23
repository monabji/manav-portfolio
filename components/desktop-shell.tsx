'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  crystalIcons,
  desktopApps,
  workspaceApps,
  desktopLinks,
  desktopUtilities,
} from '@/config/portfolio';
import { DesktopUtilityWindow } from './desktop-utility-window';
import { useDesktopSettings } from './desktop-settings';
import { DesktopShortcuts } from './desktop-shortcuts';

type UtilityState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};
type UtilityStates = Record<string, UtilityState>;
const closedUtility: UtilityState = {
  open: false,
  minimized: false,
  maximized: false,
  zIndex: 0,
};

const initialUtilities = Object.fromEntries(
  desktopUtilities.map(({ id }) => [
    id,
    {
      open: false,
      minimized: false,
      maximized: false,
      zIndex: 0,
    },
  ]),
) as UtilityStates;

function playTone(kind: 'open' | 'close' | 'select') {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const frequencies =
    kind === 'open' ? [440, 660] : kind === 'close' ? [420, 260] : [560, 720];
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
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('manav-sound') === 'on'
    )
      playTone(kind);
  };
}

function BrandIcon({
  brand,
  icon,
}: {
  brand: (typeof desktopLinks)[number]['id'];
  icon?: string;
}) {
  if (icon)
    return (
      <span
        className={`desktop-brand desktop-brand-${brand}`}
        aria-hidden="true"
      >
        <img src={icon} alt="" />
      </span>
    );
  if (brand === 'email')
    return (
      <span className="desktop-brand desktop-brand-email" aria-hidden="true">
        <img src={crystalIcons.email} alt="" />
      </span>
    );
  return (
    <span className={`desktop-brand desktop-brand-${brand}`} aria-hidden="true">
      <img src={`/brands/${brand}.svg`} alt="" />
    </span>
  );
}

function DesktopClock() {
  const [clock, setClock] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(now),
      );
      setDate(
        new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(now),
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <time>
      <span>{clock}</span>
      <span>{date}</span>
    </time>
  );
}

export function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useDesktopSettings();
  const applications = [
    ...desktopUtilities.map((app) => ({
      ...app,
      embedUrl: undefined as string | undefined,
    })),
    ...settings.shortcuts
      .filter((app) => app.mode === 'window')
      .map((app) => ({
        id: app.id,
        label: app.label,
        icon: app.icon,
        description: 'Online application',
        embedUrl: app.href,
      })),
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [startQuery, setStartQuery] = useState('');
  const [utilities, setUtilities] = useState<UtilityStates>(initialUtilities);
  const zCounter = useRef(90);
  const menuRef = useRef<HTMLDivElement>(null);
  const desktopSnapshot = useRef<UtilityStates | null>(null);
  const matchesSearch = (label: string, description = '') =>
    `${label} ${description}`
      .toLowerCase()
      .includes(startQuery.trim().toLowerCase());
  const matchingApps = desktopApps.filter((app) =>
    matchesSearch(app.label, app.description),
  );
  const matchingUtilities = applications.filter((app) =>
    matchesSearch(app.label, app.description),
  );
  const matchingLinks = desktopLinks.filter((link) =>
    matchesSearch(link.label, link.description),
  );
  const matchingShortcuts = settings.shortcuts.filter(
    (link) => link.mode !== 'window' && matchesSearch(link.label, link.href),
  );

  useEffect(() => {
    setSoundOn(localStorage.getItem('manav-sound') === 'on');
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    desktopSnapshot.current = null;
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) setStartQuery('');
  }, [menuOpen]);
  useEffect(() => {
    const open = (event: Event) => {
      const id = (event as CustomEvent).detail as string;
      if (!applications.some((app) => app.id === id)) return;
      desktopSnapshot.current = null;
      zCounter.current += 1;
      setUtilities((current) => ({
        ...current,
        [id]: {
          ...closedUtility,
          ...current[id],
          open: true,
          minimized: false,
          zIndex: zCounter.current,
        },
      }));
      setMenuOpen(false);
      if (soundOn) playTone('open');
    };
    window.addEventListener('manav:open-utility', open);
    return () => window.removeEventListener('manav:open-utility', open);
  }, [soundOn, settings.shortcuts]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !(event.target as Element).closest('.start-button')
      )
        setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  const changeUtility = (id: string, patch: Partial<UtilityState>) => {
    setUtilities((current) => ({
      ...current,
      [id]: { ...closedUtility, ...current[id], ...patch },
    }));
  };
  const openUtility = (id: string) => {
    desktopSnapshot.current = null;
    zCounter.current += 1;
    changeUtility(id, {
      open: true,
      minimized: false,
      zIndex: zCounter.current,
    });
    setMenuOpen(false);
    if (soundOn) playTone('open');
  };
  const focusUtility = (id: string) => {
    if (utilities[id]?.zIndex === zCounter.current) return;
    zCounter.current += 1;
    changeUtility(id, { zIndex: zCounter.current });
  };
  const closeUtility = (id: string) => {
    changeUtility(id, { open: false });
    if (soundOn) playTone('close');
  };
  const minimizeUtility = (id: string) => {
    changeUtility(id, { minimized: true });
    if (soundOn) playTone('close');
  };
  const maximizeUtility = (id: string) => {
    changeUtility(id, { maximized: !utilities[id]?.maximized });
    if (soundOn) playTone('select');
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('manav-sound', next ? 'on' : 'off');
    if (next) playTone('open');
  };
  const showDesktop = () => {
    setMenuOpen(false);
    if (desktopSnapshot.current) {
      setUtilities(desktopSnapshot.current);
      desktopSnapshot.current = null;
      window.dispatchEvent(new Event('manav:restore-route'));
    } else {
      desktopSnapshot.current = utilities;
      setUtilities(
        (current) =>
          Object.fromEntries(
            Object.entries(current).map(([id, state]) => [
              id,
              { ...state, minimized: true },
            ]),
          ) as UtilityStates,
      );
      window.dispatchEvent(new Event('manav:minimize-route'));
    }
    if (soundOn) playTone('select');
  };
  const onRouteClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    desktopSnapshot.current = null;
    if (pathname === href) {
      event.preventDefault();
      window.dispatchEvent(new Event('manav:restore-route'));
    }
    setMenuOpen(false);
    if (soundOn) playTone('select');
  };

  return (
    <div className="aero-desktop">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div
        className="wallpaper"
        aria-hidden="true"
        style={
          settings.wallpaper
            ? {
                backgroundImage: `url("${settings.wallpaper.replaceAll('"', '%22')}")`,
              }
            : undefined
        }
      />
      <div className="bubble-field" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <DesktopShortcuts>
        {workspaceApps
          .filter((app) => app.href !== '/')
          .map((app) => (
            <Link
              prefetch={true}
              href={app.href}
              key={`route:${app.href}`}
              title={app.description}
              onClick={(event) => onRouteClick(event, app.href)}
            >
              <img
                src={settings.iconOverrides[`route:${app.href}`] || app.icon}
                alt=""
              />
              <span>{app.label}</span>
            </Link>
          ))}
        {applications.map((app) => (
          <button
            type="button"
            key={app.id}
            title={app.description}
            onClick={() => openUtility(app.id)}
          >
            <img
              src={settings.iconOverrides[`app:${app.id}`] || app.icon}
              alt=""
            />
            <span>{app.label}</span>
          </button>
        ))}
        {desktopLinks.map((link) => (
          <a
            href={link.href}
            key={link.id}
            title={link.description}
            target={link.href.startsWith('https:') ? '_blank' : undefined}
            rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}
          >
            <BrandIcon
              brand={link.id}
              icon={settings.iconOverrides[`link:${link.id}`]}
            />
            <span>{link.label}</span>
          </a>
        ))}
        {settings.shortcuts
          .filter((link) => link.mode !== 'window')
          .map((link) => (
            <a
              href={link.href}
              key={link.id}
              title={link.href}
              target={link.href.startsWith('https:') ? '_blank' : undefined}
              rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}
            >
              <img src={link.icon} alt="" />
              <span>{link.label}</span>
            </a>
          ))}
      </DesktopShortcuts>

      <div className="desktop-workspace">{children}</div>
      {applications.map((app) => (
        <DesktopUtilityWindow
          key={app.id}
          id={app.id}
          title={app.label}
          embedUrl={app.embedUrl}
          icon={settings.iconOverrides[`app:${app.id}`] || app.icon}
          state={utilities[app.id] || closedUtility}
          onClose={() => closeUtility(app.id)}
          onMinimize={() => minimizeUtility(app.id)}
          onMaximize={() => maximizeUtility(app.id)}
          onFocus={() => focusUtility(app.id)}
        />
      ))}

      <div
        className={`start-menu ${menuOpen ? 'is-open' : ''}`}
        ref={menuRef}
        aria-hidden={!menuOpen}
      >
        <div className="start-programs">
          <nav className="has-scrollbar" aria-label="Start menu">
            {matchingApps.map((app) => (
              <Link
                prefetch={true}
                href={app.href}
                key={app.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => onRouteClick(event, app.href)}
              >
                <img
                  src={settings.iconOverrides[`route:${app.href}`] || app.icon}
                  alt=""
                />
                <span>
                  <strong>{app.label}</strong>
                  <small>{app.description}</small>
                </span>
              </Link>
            ))}
            {matchingUtilities.map((app) => (
              <button
                key={app.id}
                type="button"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => openUtility(app.id)}
              >
                <img
                  src={settings.iconOverrides[`app:${app.id}`] || app.icon}
                  alt=""
                />
                <span>
                  <strong>{app.label}</strong>
                  <small>{app.description}</small>
                </span>
              </button>
            ))}
            {matchingLinks.map((link) => (
              <a
                href={link.href}
                key={link.id}
                target={link.href.startsWith('https:') ? '_blank' : undefined}
                rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                <BrandIcon
                  brand={link.id}
                  icon={settings.iconOverrides[`link:${link.id}`]}
                />
                <span>
                  <strong>{link.label}</strong>
                  <small>{link.description}</small>
                </span>
              </a>
            ))}
            {matchingShortcuts.map((link) => (
              <a
                href={link.href}
                key={link.id}
                target={link.href.startsWith('https:') ? '_blank' : undefined}
                rel={link.href.startsWith('https:') ? 'noreferrer' : undefined}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                <img src={link.icon} alt="" />
                <span>
                  <strong>{link.label}</strong>
                  <small>{link.href}</small>
                </span>
              </a>
            ))}
            {!matchingApps.length &&
              !matchingUtilities.length &&
              !matchingLinks.length &&
              !matchingShortcuts.length && (
                <p className="start-empty">No programs found.</p>
              )}
          </nav>
          <label className="start-search">
            <input
              aria-label="Search programs"
              placeholder="Search programs"
              value={startQuery}
              onChange={(event) => setStartQuery(event.target.value)}
              tabIndex={menuOpen ? 0 : -1}
            />
            <span className="search-symbol" aria-hidden="true" />
          </label>
        </div>
        <div className="start-places">
          <div className="start-user">
            <img src={crystalIcons.profile} alt="" />
            <div>
              <strong>Manav</strong>
              <span>VIT Vellore</span>
            </div>
          </div>
          <Link
            prefetch={true}
            href="/about"
            tabIndex={menuOpen ? 0 : -1}
            onClick={(event) => onRouteClick(event, '/about')}
          >
            About Manav
          </Link>
          <Link
            prefetch={true}
            href="/projects"
            tabIndex={menuOpen ? 0 : -1}
            onClick={(event) => onRouteClick(event, '/projects')}
          >
            Projects
          </Link>
          <button
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => openUtility('gallery')}
          >
            Pictures
          </button>
          <button
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => openUtility('music')}
          >
            Music
          </button>
          <div className="start-separator" />
          <Link
            prefetch={true}
            href="/dashboard"
            tabIndex={menuOpen ? 0 : -1}
            onClick={(event) => onRouteClick(event, '/dashboard')}
          >
            Control Panel
          </Link>
          <a
            href="/asset-credits.txt"
            target="_blank"
            rel="noreferrer"
            tabIndex={menuOpen ? 0 : -1}
          >
            Asset credits
          </a>
          <button
            className="start-desktop"
            type="button"
            tabIndex={menuOpen ? 0 : -1}
            onClick={showDesktop}
          >
            Show desktop
          </button>
        </div>
      </div>

      <footer className="taskbar">
        <button
          className={`start-button ${menuOpen ? 'is-active' : ''}`}
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close start menu' : 'Open start menu'}
          onClick={() => {
            setMenuOpen((open) => !open);
            if (soundOn) playTone('select');
          }}
        >
          <span className="start-orb native-start-orb" aria-hidden="true" />
        </button>
        <nav className="taskbar-apps" aria-label="Portfolio and apps">
          {workspaceApps.map((app) => (
            <Link
              prefetch={true}
              href={app.href}
              key={app.href}
              title={app.label}
              aria-label={app.label}
              className={pathname === app.href ? 'is-active' : ''}
              aria-current={pathname === app.href ? 'page' : undefined}
              onClick={(event) => onRouteClick(event, app.href)}
            >
              <img
                src={settings.iconOverrides[`route:${app.href}`] || app.icon}
                alt=""
              />
              <span>{app.label}</span>
            </Link>
          ))}
          {applications.map((app) => (
            <button
              key={app.id}
              type="button"
              title={app.label}
              aria-label={`Open ${app.label}`}
              className={`${utilities[app.id]?.open ? 'is-running' : ''} ${utilities[app.id]?.open && !utilities[app.id]?.minimized ? 'is-active' : ''}`}
              onClick={() => openUtility(app.id)}
            >
              <img
                src={settings.iconOverrides[`app:${app.id}`] || app.icon}
                alt=""
              />
              <span>{app.label}</span>
            </button>
          ))}
        </nav>
        <div className="tray">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}
            title={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}
          >
            <img
              src={
                soundOn
                  ? '/win7/shell/volume.webp'
                  : '/win7/shell/volume-muted.webp'
              }
              alt=""
            />
            <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
          </button>
          <DesktopClock />
        </div>
        <button
          type="button"
          className="show-desktop"
          onClick={showDesktop}
          title="Show or restore desktop"
          aria-label="Show or restore desktop"
        />
      </footer>
    </div>
  );
}
