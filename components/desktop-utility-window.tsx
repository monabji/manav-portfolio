'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { SnakeGame } from './snake-game';
import { OnlineGameApp } from './online-game-app';
import { SpotifyMusic } from './spotify-music';
import { crystalIcons } from '@/config/portfolio';
import {
  ExplorerChrome,
  ExplorerSidebar,
  WindowTitlebar,
} from './window-chrome';

type UtilityState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

function Notepad() {
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNote(localStorage.getItem('manav-notepad') || '');
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem('manav-notepad', note);
  }, [loaded, note]);

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([note], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'manav-notepad.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="notepad-app">
      <div className="utility-menubar">
        <button
          type="button"
          onClick={() => {
            setNote('');
            textRef.current?.focus();
          }}
        >
          New
        </button>
        <button type="button" onClick={download}>
          Save as .txt
        </button>
        <button type="button" onClick={() => textRef.current?.select()}>
          Select all
        </button>
      </div>
      <textarea
        className="has-scrollbar"
        ref={textRef}
        aria-label="Notepad text"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        onKeyDown={(event) => {
          if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === 's'
          ) {
            event.preventDefault();
            download();
          }
        }}
        spellCheck={false}
        placeholder="Type anything here. Your note saves in this browser."
      />
      <div className="utility-status">
        <span>Saved on this device</span>
        <span>{note.length} characters</span>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="gallery-app has-scrollbar">
      <div className="gallery-toolbar">
        <span>Pictures Library</span>
        <span>0 items</span>
      </div>
      <div className="gallery-empty">
        <img src={crystalIcons.gallery} alt="" />
        <strong>This folder is empty</strong>
        <span>Photos you add later will appear here.</span>
      </div>
      <div className="utility-status">
        <span>Gallery</span>
        <span>0 pictures</span>
      </div>
    </div>
  );
}

// Window position and stacking changes should not rerender the running apps.
const UtilityContent = memo(function UtilityContent({
  id,
  embedUrl,
  title,
  active,
}: {
  id: string;
  embedUrl?: string;
  title: string;
  active: boolean;
}) {
  return embedUrl ? (
    <div className="custom-application">
      <div className="utility-menubar">
        <a href={embedUrl} target="_blank" rel="noopener noreferrer">
          Open in a new tab
        </a>
        <span>Some providers do not allow embedded windows.</span>
      </div>
      <iframe
        title={title}
        src={embedUrl}
        sandbox="allow-scripts allow-forms allow-popups"
        referrerPolicy="no-referrer"
        allow="fullscreen"
      />
    </div>
  ) : id === 'notepad' ? (
    <Notepad />
  ) : id === 'snake' ? (
    <SnakeGame active={active} />
  ) : id === 'doom' ? (
    <OnlineGameApp gameId="doom" />
  ) : (
    <div className="utility-library-body">
      <ExplorerSidebar />
      {id === 'gallery' ? <Gallery /> : <SpotifyMusic />}
    </div>
  );
});

export function DesktopUtilityWindow({
  id,
  title,
  icon,
  state,
  embedUrl,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: {
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
  const [offset, setOffset] = useState(() =>
    id === 'notepad'
      ? { x: -85, y: -22 }
      : id === 'doom'
        ? { x: 0, y: 0 }
        : { x: 105, y: 18 },
  );
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const windowRef = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    nextX: number;
    nextY: number;
    pointerId: number;
    target: HTMLElement;
  } | null>(null);
  const finishDrag = useCallback((event?: React.PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current || (event && event.pointerId !== current.pointerId)) return;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    windowRef.current?.style.setProperty('--window-x', `${current.nextX}px`);
    windowRef.current?.style.setProperty('--window-y', `${current.nextY}px`);
    setOffset({ x: current.nextX, y: current.nextY });
    drag.current = null;
    if (current.target.hasPointerCapture(current.pointerId))
      current.target.releasePointerCapture(current.pointerId);
  }, []);

  useEffect(() => {
    if (!state.open || state.minimized || state.maximized) finishDrag();
  }, [state.open, state.minimized, state.maximized, finishDrag]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      const current = drag.current;
      drag.current = null;
      if (current?.target.hasPointerCapture(current.pointerId))
        current.target.releasePointerCapture(current.pointerId);
    },
    [],
  );

  if (!state.open) return null;

  const pointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (
      state.maximized ||
      drag.current ||
      (event.target as Element).closest('.window-controls')
    )
      return;
    onFocus();
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: offset.x,
      startY: offset.y,
      nextX: offset.x,
      nextY: offset.y,
      pointerId: event.pointerId,
      target: event.currentTarget,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.nextX = current.startX + event.clientX - current.x;
    current.nextY = current.startY + event.clientY - current.y;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const position = drag.current;
      if (!position) return;
      windowRef.current?.style.setProperty('--window-x', `${position.nextX}px`);
      windowRef.current?.style.setProperty('--window-y', `${position.nextY}px`);
    });
  };

  return (
    <section
      ref={windowRef}
      className={`window glass active is-bright aero-window utility-window utility-${id} ${state.maximized ? 'is-maximized' : ''} ${sidebarHidden ? 'navigation-hidden' : ''}`}
      style={
        {
          zIndex: state.zIndex,
          '--window-x': `${offset.x}px`,
          '--window-y': `${offset.y}px`,
        } as React.CSSProperties
      }
      hidden={state.minimized}
      role="dialog"
      aria-label={`${title} window`}
      onPointerDown={onFocus}
    >
      <WindowTitlebar
        title={title}
        icon={icon}
        maximized={state.maximized}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        className="utility-titlebar"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onDoubleClick={onMaximize}
      />
      <div className="window-interior">
        <ExplorerChrome
          title={title}
          icon={icon}
          breadcrumbs={[{ label: 'Applications' }, { label: title }]}
          onToggleSidebar={
            id === 'gallery' || id === 'music'
              ? () => setSidebarHidden((value) => !value)
              : undefined
          }
        />
        <UtilityContent
          id={id}
          embedUrl={embedUrl}
          title={title}
          active={!state.minimized}
        />
      </div>
    </section>
  );
}
