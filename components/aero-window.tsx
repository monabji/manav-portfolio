'use client';

import { useState } from 'react';
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
  const sound = useAeroSound();

  if (minimized) {
    return (
      <button className="restore-window" type="button" onClick={() => { setMinimized(false); sound('open'); }}>
        <img src={icon} alt="" /> Restore {title}
      </button>
    );
  }

  return (
    <section className={`aero-window ${maximized ? 'is-maximized' : ''} ${className}`} aria-label={`${title} window`}>
      <header className="window-titlebar">
        <div className="window-title"><img src={icon} alt="" /><span>{title}</span></div>
        <div className="window-controls" aria-label="Window controls">
          <button type="button" aria-label={`Minimize ${title}`} title="Minimize" onClick={() => { setMinimized(true); sound('close'); }}>_</button>
          <button type="button" aria-label={maximized ? `Restore ${title}` : `Maximize ${title}`} title={maximized ? 'Restore' : 'Maximize'} onClick={() => { setMaximized((value) => !value); sound('select'); }}>{maximized ? '❐' : '□'}</button>
          <a href="/" aria-label={`Close ${title}`} title="Close" onClick={() => sound('close')}>×</a>
        </div>
      </header>
      {children}
    </section>
  );
}
