import { PeopleHero3D } from '@/components/people-hero-3d';
import { AeroWindow } from '@/components/aero-window';
import { crystalIcons } from '@/config/portfolio';

export default function Home() {
  return (
    <main className="route-stage home-stage" id="main-content">
      <AeroWindow title="Welcome to Manav OS" icon={crystalIcons.home} className="home-window">
        <div className="window-menubar"><span>File</span><span>Explore</span><span>Help</span></div>
        <div className="home-window-body">
          <div className="landing-copy">
            <h1 id="landing-title">Manav</h1>
            <p>a boy who loves tech.</p>
            <nav className="landing-actions" aria-label="Explore Manav's portfolio">
              <a href="/about" className="aero-button aero-button-primary"><img src={crystalIcons.profile} alt="" />know more about me</a>
              <a href="/projects" className="aero-button aero-button-secondary"><img src={crystalIcons.blender} alt="" />my projects</a>
            </nav>
            <p className="desktop-hint">Double-click the desktop shortcuts or use the taskbar to explore.</p>
          </div>
          <PeopleHero3D />
        </div>
        <div className="window-status"><span>Ready</span><span>3 pages · 11 projects</span></div>
      </AeroWindow>
    </main>
  );
}
