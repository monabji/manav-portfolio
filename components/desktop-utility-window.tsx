'use client';

import { useEffect, useRef, useState } from 'react';
import { type DesktopUtilityId } from '@/config/portfolio';
import { SnakeGame } from './snake-game';
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

const includedMusic = [
  { title: 'Emotional piano.wav', artist: 'triangelx', src: '/music/calm-piano.wav', format: 'WAV' },
  { title: 'Ambiant Wait.ogg', artist: 'Komiku', src: '/music/ambiant-wait.ogg', format: 'OGG' },
] as const;

function MusicPlayer() {
  const [selectedSrc, setSelectedSrc] = useState<string>(includedMusic[0].src);
  const [selectedTitle, setSelectedTitle] = useState<string>(includedMusic[0].title);
  const [localTracks, setLocalTracks] = useState<Array<{ title: string; src: string }>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => () => localTracks.forEach((track) => URL.revokeObjectURL(track.src)), [localTracks]);

  const selectTrack = (title: string, src: string) => {
    setSelectedTitle(title);
    setSelectedSrc(src);
  };

  const loadLocalMusic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('audio/'));
    if (!files.length) return;
    const tracks = files.map((file) => ({ title: file.name, src: URL.createObjectURL(file) }));
    setLocalTracks((current) => {
      current.forEach((track) => URL.revokeObjectURL(track.src));
      return tracks;
    });
    selectTrack(tracks[0].title, tracks[0].src);
    event.target.value = '';
  };

  return <div className="music-app has-scrollbar">
    <div className="music-address"><img src="/crystal/sound.png" alt="" /><span>Manav OS</span><b>›</b><strong>Music</strong><b>›</b><span>Sample Music</span></div>
    <div className="music-layout">
      <section className="music-file-list has-scrollbar" aria-label="Music files">
        <div className="music-column-head"><span>Name</span><span>Type</span><span>Artist</span></div>
        {includedMusic.map((track) => <button type="button" key={track.src} className={selectedSrc === track.src ? 'is-selected' : ''} onClick={() => selectTrack(track.title, track.src)}>
          <img src="/crystal/sound.png" alt="" /><span>{track.title}</span><small>{track.format}</small><small>{track.artist}</small>
        </button>)}
        {localTracks.map((track) => <button type="button" key={track.src} className={selectedSrc === track.src ? 'is-selected' : ''} onClick={() => selectTrack(track.title, track.src)}>
          <img src="/crystal/sound.png" alt="" /><span>{track.title}</span><small>Audio</small><small>On this device</small>
        </button>)}
        <label className="music-add-file">Add music from this device<input type="file" accept="audio/*" multiple onChange={loadLocalMusic} /></label>
      </section>
      <section className="music-now-playing" aria-label="Music player">
        <div className="music-record"><img src="/crystal/sound.png" alt="" /></div>
        <div><small>NOW SELECTED</small><strong>{selectedTitle}</strong></div>
        <audio ref={audioRef} controls preload="metadata" src={selectedSrc} aria-label={`Play ${selectedTitle}`} />
        <span>Included demo tracks are freely licensed. Load your own Windows sample files to play those here.</span>
      </section>
    </div>
    <div className="utility-status"><span>Sample Music</span><span>{includedMusic.length + localTracks.length} audio files</span></div>
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
    {id === 'notepad' ? <Notepad /> : id === 'snake' ? <SnakeGame active={!state.minimized} /> : <div className="utility-library-body"><ExplorerSidebar />{id === 'gallery' ? <Gallery /> : <MusicPlayer />}</div>}
    </div>
  </section>;
}
