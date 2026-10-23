'use client';

import { useEffect, useRef, useState } from 'react';
import { onlineGames } from '@/config/portfolio';

export function OnlineGameApp({
  gameId,
}: {
  gameId: keyof typeof onlineGames;
}) {
  const game = onlineGames[gameId];
  const [instance, setInstance] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (width && height) setScale(Math.min(width / 680, height / 660));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const reload = () => {
    setLoaded(false);
    setInstance((current) => current + 1);
  };

  return (
    <div className="online-game-app">
      <div className="online-game-toolbar">
        <span>
          Click “Click to start” below. First startup can take a minute. Press
          Enter to choose a game once DOOM loads.
        </span>
        <button type="button" onClick={() => playerRef.current?.focus()}>
          Focus game
        </button>
        <button type="button" onClick={reload}>
          Reload game
        </button>
        <a href={game.sourceUrl} target="_blank" rel="noreferrer">
          Player website
        </a>
      </div>
      <div className="online-game-stage" ref={stageRef}>
        {!loaded && (
          <p className="online-game-loading" role="status">
            Loading {game.title}...
          </p>
        )}
        <iframe
          key={instance}
          ref={playerRef}
          title={`${game.title} online game`}
          src={game.embedUrl}
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="online-game-controls">
        Arrows: move / turn · S: fire · W: use · A / D: strafe · 1–7: weapons ·
        Esc: menu
      </div>
      <div className="utility-status">
        <span>{game.title}</span>
        <span>Online game hosted by {game.provider}</span>
      </div>
    </div>
  );
}
