'use client';

import { useEffect, useRef, useState } from 'react';

const colours = ['yellow', 'blue', 'pink', 'grey'] as const;
type Colour = (typeof colours)[number];
type Note = { id: string; text: string; colour: Colour; x: number; y: number };
const storageKey = 'manav-sticky-notes-v1';

function position(x: number, y: number) {
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - Math.min(300, window.innerWidth - 16) - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - Math.min(300, window.innerHeight - 68) - 52)),
  };
}

export function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [palette, setPalette] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const editors = useRef(new Map<string, HTMLTextAreaElement>());
  const drag = useRef<{ id: string; pointer: number; x: number; y: number; left: number; top: number } | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(saved)) setNotes(saved.filter((n): n is Note =>
        n && typeof n.id === 'string' && typeof n.text === 'string' &&
        colours.includes(n.colour) && Number.isFinite(n.x) && Number.isFinite(n.y)
      ).map(n => ({ ...n, ...position(n.x, n.y) })));
    } catch { setSaveError(true); }
    setReady(true);
    });
    const resize = () => setNotes(current => current.map(n => ({ ...n, ...position(n.x, n.y) })));
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let failed = false;
    try { localStorage.setItem(storageKey, JSON.stringify(notes)); }
    catch { failed = true; }
    const frame = requestAnimationFrame(() => setSaveError(failed));
    return () => cancelAnimationFrame(frame);
  }, [notes, ready]);

  useEffect(() => {
    if (focusId) editors.current.get(focusId)?.focus();
  }, [focusId]);

  const add = () => {
    const id = crypto.randomUUID();
    setNotes(current => [...current, {
      id, text: '', colour: colours[current.length % colours.length],
      ...position(window.innerWidth - 330 - (current.length % 5) * 28, 72 + (current.length % 5) * 28),
    }]);
    setFocusId(id);
    setPalette(null);
  };
  useEffect(() => {
    const open = () => add();
    window.addEventListener('manav:new-sticky-note', open);
    return () => window.removeEventListener('manav:new-sticky-note', open);
  }, []);
  const update = (id: string, patch: Partial<Note>) => setNotes(current => current.map(n => n.id === id ? { ...n, ...patch } : n));
  const raise = (id: string) => setNotes(current => {
    const note = current.find(n => n.id === id);
    return note && current.at(-1)?.id !== id ? [...current.filter(n => n.id !== id), note] : current;
  });

  return <>
    <div className="sticky-notes-layer" aria-label="Sticky notes">
      {notes.map((note, index) => <section key={note.id} className={`sticky-note sticky-note-${note.colour}`} aria-label={`${note.colour} sticky note`} style={{ left: note.x, top: note.y, zIndex: 100 + index }} onPointerDown={() => raise(note.id)}>
        <div className="sticky-note-header">
          <button type="button" aria-label="New sticky note" title="New note" onClick={add}>+</button>
          <button type="button" className="sticky-note-drag" aria-label="Move sticky note" title="Drag to move, or use arrow keys"
          onKeyDown={event => {
            if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            update(note.id, position(note.x + (event.key === 'ArrowRight' ? 10 : event.key === 'ArrowLeft' ? -10 : 0), note.y + (event.key === 'ArrowDown' ? 10 : event.key === 'ArrowUp' ? -10 : 0)));
          }}
          onPointerDown={event => {
            if (event.button !== 0) return;
            drag.current = { id: note.id, pointer: event.pointerId, x: event.clientX, y: event.clientY, left: note.x, top: note.y };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
          }}
          onPointerMove={event => {
            const active = drag.current;
            if (active?.id === note.id && active.pointer === event.pointerId) update(note.id, position(active.left + event.clientX - active.x, active.top + event.clientY - active.y));
          }}
          onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          </button>
          <button type="button" className="sticky-note-colour-button" aria-label="Change note colour" aria-expanded={palette === note.id} onClick={() => setPalette(palette === note.id ? null : note.id)}>•••</button>
          <button type="button" className="sticky-note-close" aria-label="Close sticky note" title="Close note" onClick={() => {
            setNotes(current => current.filter(n => n.id !== note.id));
            setPalette(null);
          }}>×</button>
        </div>
        {palette === note.id && <fieldset className="sticky-note-palette" aria-label="Note colour">
          {colours.map(colour => <button type="button" key={colour} className={`sticky-note-${colour}`} aria-label={colour} aria-pressed={note.colour === colour} onClick={() => { update(note.id, { colour }); setPalette(null); }}>{note.colour === colour ? '✓' : ''}</button>)}
        </fieldset>}
        <textarea ref={element => { if (element) editors.current.set(note.id, element); else editors.current.delete(note.id); }} aria-label="Sticky note text" spellCheck value={note.text} onChange={event => update(note.id, { text: event.target.value })} />
        {saveError && <output>Notes stay open, but couldn’t be saved in this browser.</output>}
      </section>)}
    </div>
  </>;
}
