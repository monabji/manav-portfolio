'use client';
import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import { desktopHash, scatterDesktop } from '@/lib/desktop-layout';

export function DesktopShortcuts({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState({ width: 1024, height: 640 });
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const icons = Children.toArray(children).filter(isValidElement);
  const keys = icons.map(icon => String(icon.key));
  const { positions, canvasHeight } = scatterDesktop(keys, bounds.width, bounds.height);
  return <aside className="desktop-icons scattered-desktop" aria-label="Desktop shortcuts" ref={container}>
    <div className="desktop-icon-canvas" style={{ '--desktop-canvas-height': `${canvasHeight}px` } as React.CSSProperties}>
      {icons.map((icon, index) => <div key={icon.key} className="desktop-icon-position" style={{
        '--desktop-icon-x': `${positions[keys[index]].x}px`, '--desktop-icon-y': `${positions[keys[index]].y}px`,
        '--desktop-icon-order': desktopHash(keys[index]) % 10000,
        '--desktop-icon-nudge': `${desktopHash(keys[index]) % 9}px`,
      } as React.CSSProperties}>{icon}</div>)}
    </div>
  </aside>;
}
