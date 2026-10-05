'use client';

import { useEffect, useState } from 'react';
import { useAeroSound } from './desktop-shell';
import { ExplorerChrome, WindowTitlebar, type Breadcrumb } from './window-chrome';

export function AeroWindow({
  title,
  icon,
  children,
  className = '',
  breadcrumbs,
  hasSidebar = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  breadcrumbs?: Breadcrumb[];
  hasSidebar?: boolean;
}) {
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
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
    <section className={`window glass active is-bright aero-window ${maximized ? 'is-maximized' : ''} ${sidebarHidden ? 'navigation-hidden' : ''} ${className}`} aria-label={`${title} window`}>
      <WindowTitlebar title={title} icon={icon} maximized={maximized} onDoubleClick={() => { setMaximized(value => !value); sound('select'); }} onMinimize={() => { setMinimized(true); sound('close'); }} onMaximize={() => { setMaximized(value => !value); sound('select'); }} onClose={() => { setClosed(true); sound('close'); }} />
      <div className="window-interior">
      <ExplorerChrome title={title} icon={icon} breadcrumbs={breadcrumbs} onToggleSidebar={hasSidebar ? () => setSidebarHidden(value => !value) : undefined} />
      {children}
      </div>
    </section>
  );
}
