import Link from 'next/link';
import { PeopleHero3D } from '@/components/people-hero-3d';
import { AeroWindow } from '@/components/aero-window';
import { crystalIcons } from '@/config/portfolio';
import { defaultSettings } from '@/lib/site-configuration';

export const dynamic = 'force-static';

export default function Home() {
  const projectCount =
    defaultSettings.softwareProjects.length + defaultSettings.designProjects.length;
  return (
    <main className="route-stage home-stage" id="main-content">
      <AeroWindow
        title="Welcome to Manav OS"
        icon={crystalIcons.home}
        className="home-window"
      >
        <div className="home-window-body">
          <div className="landing-copy">
            <h1 id="landing-title">Manav</h1>
            <p>a boy who loves tech.</p>
            <nav
              className="landing-actions"
              aria-label="Explore Manav's portfolio"
            >
              <Link
                prefetch={true}
                href="/about"
                className="aero-button aero-button-primary"
              >
                <img src={crystalIcons.profile} alt="" />
                know more about me
              </Link>
              <Link
                prefetch={true}
                href="/projects"
                className="aero-button aero-button-secondary"
              >
                <img src={crystalIcons.projects} alt="" />
                my projects
              </Link>
            </nav>
            <p className="desktop-hint">
              Open a shortcut or choose an app from the taskbar.
            </p>
          </div>
          <PeopleHero3D />
        </div>
        <div className="window-status">
          <span>Ready</span>
          <span>4 pages · {projectCount} projects</span>
        </div>
      </AeroWindow>
    </main>
  );
}
