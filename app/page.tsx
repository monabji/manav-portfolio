import { AeroOrbit } from '@/components/aero-orbit';
import { AeroWindow } from '@/components/aero-window';

export default function Home() {
  return (
    <main className="route-stage home-stage" id="main-content">
      <AeroWindow title="Welcome to Manav OS" icon="/aero/home.png" className="home-window">
        <div className="window-menubar"><span>File</span><span>Explore</span><span>Help</span></div>
        <div className="home-window-body">
          <div className="landing-copy">
            <p className="welcome-chip"><span /> ONLINE</p>
            <h1 id="landing-title">Manav</h1>
            <p>a boy who loves tech.</p>
            <nav className="landing-actions" aria-label="Explore Manav's portfolio">
              <a href="/about" className="aero-button aero-button-primary"><img src="/aero/profile.png" alt="" />know more about me</a>
              <a href="/projects" className="aero-button aero-button-secondary"><img src="/aero/games.png" alt="" />my projects</a>
            </nav>
            <p className="desktop-hint">Double-click the desktop shortcuts or use the taskbar to explore.</p>
          </div>
          <AeroOrbit />
        </div>
        <div className="window-status"><span>Ready</span><span>3 pages · 11 projects</span></div>
      </AeroWindow>
    </main>
  );
}
