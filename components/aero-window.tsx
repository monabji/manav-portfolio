'use client';

import { useEffect, useState } from 'react';
import { useAeroSound } from './desktop-shell';

export function AeroWindow({
  title,
  icon,
  children,
  className = '',
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const sound = useAeroSound();

  useEffect(() => {
    const restore = () => { setClosed(false); setMinimized(false); };
    const minimize = () => setMinimized(true);
    window.addEventListener('manav:restore-route', restore);
    window.addEventListener('manav:minimize-route', minimize);
    return () => { window.removeEventListener('manav:restore-route', restore); window.removeEventListener('manav:minimize-route', minimize); };
  }, []);

  if (minimized || closed) return null;

  return (
    <section className={`aero-window ${maximized ? 'is-maximized' : ''} ${className}`} aria-label={`${title} window`}>
      <header className="window-titlebar" onDoubleClick={() => { setMaximized((value) => !value); sound('select'); }}>
        <div className="window-title"><img src={icon} alt="" /><span>{title}</span></div>
        <div className="window-controls" aria-label="Window controls">
          <button type="button" aria-label={`Minimize ${title}`} title="Minimize" onClick={() => { setMinimized(true); sound('close'); }}>_</button>
          <button type="button" aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`} title={maximized ? 'Restore' : 'Maximize'} onClick={() => { setMaximized((value) => !value); sound('select'); }}>{maximized ? '❐' : '□'}</button>
          <button className="window-close" type="button" aria-label={`Close ${title}`} title="Close" onClick={() => { setClosed(true); sound('close'); }}>×</button>
        </div>
      </header>
      {children}
    </section>
  );
}
