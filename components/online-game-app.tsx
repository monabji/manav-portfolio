'use client';

import { useEffect, useRef, useState } from 'react';
import { onlineGames } from '@/config/portfolio';

export function OnlineGameApp({ gameId }: { gameId: keyof typeof onlineGames }) {
  const game = onlineGames[gameId];
  const [instance, setInstance] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (width && height) setScale(Math.min(width / 640, height / 480));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const reload = () => { setLoaded(false); setInstance(current => current + 1); };

  return <div className="online-game-app">
    <div className="online-game-toolbar">
      <span>Click inside the game to use your keyboard.</span>
      <button type="button" onClick={reload}>Reload game</button>
      <a href={game.sourceUrl} target="_blank" rel="noreferrer">Open on {game.provider}</a>
    </div>
    <div className="online-game-stage" ref={stageRef}>
      {!loaded && <p className="online-game-loading" role="status">Loading {game.title}...</p>}
      <iframe key={instance} title={`${game.title} online game`} src={game.embedUrl}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
        allow="autoplay; fullscreen; gamepad" allowFullScreen referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)} />
    </div>
    <div className="utility-status"><span>{game.title}</span><span>Online game hosted by {game.provider}</span></div>
  </div>;
}
