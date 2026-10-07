'use client';

import { useEffect, useRef, useState } from 'react';
import { SnakeGame } from './snake-game';
import { OnlineGameApp } from './online-game-app';
import { SpotifyMusic } from './spotify-music';
import { ExplorerChrome, ExplorerSidebar, WindowTitlebar } from './window-chrome';

type UtilityState = { open: boolean; minimized: boolean; maximized: boolean; zIndex: number };

function Notepad() {
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNote(localStorage.getItem('manav-notepad') || '');
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem('manav-notepad', note); }, [loaded, note]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([note], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'manav-notepad.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="notepad-app">
    <div className="utility-menubar">
      <button type="button" onClick={() => { setNote(''); textRef.current?.focus(); }}>New</button>
      <button type="button" onClick={download}>Save as .txt</button>
      <button type="button" onClick={() => textRef.current?.select()}>Select all</button>
    </div>
    <textarea className="has-scrollbar" ref={textRef} aria-label="Notepad text" value={note} onChange={(event) => setNote(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); download(); } }} spellCheck={false} placeholder="Type anything here. Your note saves in this browser." />
    <div className="utility-status"><span>Saved on this device</span><span>{note.length} characters</span></div>
  </div>;
}

function Gallery() {
  return <div className="gallery-app has-scrollbar">
    <div className="gallery-toolbar"><span>Pictures Library</span><span>0 items</span></div>
    <div className="gallery-empty">
      <img src="/crystal/gallery.png" alt="" />
      <strong>This folder is empty</strong>
      <span>Photos you add later will appear here.</span>
    </div>
    <div className="utility-status"><span>Gallery</span><span>0 pictures</span></div>
  </div>;
}

export function DesktopUtilityWindow({ id, title, icon, state, embedUrl, onClose, onMinimize, onMaximize, onFocus }: {
  id: string;
  embedUrl?: string;
  title: string;
  icon: string;
  state: UtilityState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}) {
  const [offset, setOffset] = useState(() => id === 'notepad' ? { x: -85, y: -22 } : id === 'doom' ? { x: 0, y: 0 } : { x: 105, y: 18 });
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  if (!state.open) return null;

  const pointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (state.maximized || (event.target as Element).closest('.window-controls')) return;
    onFocus();
    drag.current = { x: event.clientX, y: event.clientY, startX: offset.x, startY: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    setOffset({ x: drag.current.startX + event.clientX - drag.current.x, y: drag.current.startY + event.clientY - drag.current.y });
  };

  return <section
    className={`window glass active is-bright aero-window utility-window utility-${id} ${state.maximized ? 'is-maximized' : ''} ${sidebarHidden ? 'navigation-hidden' : ''}`}
    style={{ zIndex: state.zIndex, '--window-x': `${offset.x}px`, '--window-y': `${offset.y}px` } as React.CSSProperties}
    hidden={state.minimized}
    role="dialog"
    aria-label={`${title} window`}
    onPointerDown={onFocus}
  >
    <WindowTitlebar title={title} icon={icon} maximized={state.maximized} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} className="utility-titlebar" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onDoubleClick={onMaximize} />
    <div className="window-interior">
    <ExplorerChrome title={title} icon={icon} breadcrumbs={[{ label: 'Applications' }, { label: title }]} onToggleSidebar={id === 'gallery' || id === 'music' ? () => setSidebarHidden(value => !value) : undefined} />
    {embedUrl ? <div className="custom-application"><div className="utility-menubar"><a href={embedUrl} target="_blank" rel="noopener noreferrer">Open in a new tab</a><span>Some providers do not allow embedded windows.</span></div><iframe title={title} src={embedUrl} sandbox="allow-scripts allow-forms allow-popups" referrerPolicy="no-referrer" allow="fullscreen" /></div> : id === 'notepad' ? <Notepad /> : id === 'snake' ? <SnakeGame active={!state.minimized} /> : id === 'doom' ? <OnlineGameApp gameId="doom" /> : <div className="utility-library-body"><ExplorerSidebar />{id === 'gallery' ? <Gallery /> : <SpotifyMusic />}</div>}
    </div>
  </section>;
}
