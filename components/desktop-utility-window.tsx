'use client';

import { useEffect, useRef, useState } from 'react';
import { type DesktopUtilityId } from '@/config/portfolio';
import { SnakeGame } from './snake-game';

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
    <textarea ref={textRef} aria-label="Notepad text" value={note} onChange={(event) => setNote(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); download(); } }} spellCheck={false} placeholder="Type anything here. Your note saves in this browser." />
    <div className="utility-status"><span>Saved on this device</span><span>{note.length} characters</span></div>
  </div>;
}

export function DesktopUtilityWindow({ id, title, icon, state, onClose, onMinimize, onMaximize, onFocus }: {
  id: DesktopUtilityId;
  title: string;
  icon: string;
  state: UtilityState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}) {
  const [offset, setOffset] = useState(() => id === 'notepad' ? { x: -85, y: -22 } : { x: 105, y: 18 });
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
    className={`aero-window utility-window utility-${id} ${state.maximized ? 'is-maximized' : ''}`}
    style={{ zIndex: state.zIndex, '--window-x': `${offset.x}px`, '--window-y': `${offset.y}px` } as React.CSSProperties}
    hidden={state.minimized}
    role="dialog"
    aria-label={`${title} window`}
    onPointerDown={onFocus}
  >
    <header className="window-titlebar utility-titlebar" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; }} onDoubleClick={onMaximize}>
      <div className="window-title"><img src={icon} alt="" /><span>{title}</span></div>
      <div className="window-controls" aria-label={`${title} controls`}>
        <button type="button" onClick={onMinimize} aria-label={`Minimize ${title}`} title="Minimize">_</button>
        <button type="button" onClick={onMaximize} aria-label={state.maximized ? `Restore ${title}` : `Maximize ${title}`} title={state.maximized ? 'Restore' : 'Maximize'}>{state.maximized ? '❐' : '□'}</button>
        <button type="button" className="window-close" onClick={onClose} aria-label={`Close ${title}`} title="Close">×</button>
      </div>
    </header>
    {id === 'notepad' ? <Notepad /> : <SnakeGame active={!state.minimized} />}
  </section>;
}
