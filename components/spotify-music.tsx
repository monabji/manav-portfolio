import { spotifyMusic } from '@/config/portfolio';

export function SpotifyMusic() {
  return <div className="music-app spotify-music-app has-scrollbar">
    <div className="utility-menubar"><a href={spotifyMusic.profileUrl} target="_blank" rel="noopener noreferrer">My Spotify profile</a></div>
    <div className="spotify-player">
      <iframe
        data-testid="embed-iframe"
        title="Manav's Spotify playlist"
        src={spotifyMusic.embedUrl}
        width="100%"
        height="352"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
    <div className="utility-status"><span>Spotify playlist</span><a href={spotifyMusic.playlistUrl} target="_blank" rel="noopener noreferrer">Open in Spotify</a></div>
  </div>;
}
