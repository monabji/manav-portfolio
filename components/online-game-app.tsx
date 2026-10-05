'use client';

import { useState } from 'react';
import { onlineGames } from '@/config/portfolio';

export function OnlineGameApp({ gameId }: { gameId: keyof typeof onlineGames }) {
  const game = onlineGames[gameId];
  const [instance, setInstance] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const reload = () => { setLoaded(false); setInstance(current => current + 1); };

  return <div className="online-game-app">
    <div className="online-game-toolbar">
      <span>Click inside the game to use your keyboard.</span>
      <button type="button" onClick={reload}>Reload game</button>
      <a href={game.sourceUrl} target="_blank" rel="noreferrer">Open on {game.provider}</a>
    </div>
    <div className="online-game-stage">
      {!loaded && <p className="online-game-loading" role="status">Loading {game.title}...</p>}
      <iframe key={instance} title={`${game.title} online game`} src={game.embedUrl}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-downloads"
        allow="autoplay; fullscreen; gamepad" allowFullScreen referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)} />
    </div>
    <div className="utility-status"><span>{game.title}</span><span>Online game hosted by {game.provider}</span></div>
  </div>;
}
