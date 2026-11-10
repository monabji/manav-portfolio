import Link from 'next/link';
import { AeroWindow } from '@/components/aero-window';
import { windows7Icons } from '@/config/portfolio';
import { defaultSettings } from '@/lib/site-configuration';
import { publicPath } from '@/lib/public-path';

export const dynamic = 'force-static';

export default function Home() {
  const projectCount =
    defaultSettings.softwareProjects.length + defaultSettings.designProjects.length;
  return (
    <main className="route-stage home-stage" id="main-content">
      <AeroWindow
        title="Welcome to Manav OS"
        icon={windows7Icons.home}
        className="home-window"
      >
        <div
          className="home-window-body"
          style={{
            backgroundImage: `linear-gradient(rgba(242,250,255,.28), rgba(232,246,252,.18)), url("${publicPath('/wallpapers/bliss-xp.png')}")`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
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
                <img src={windows7Icons.profile} alt="" />
                know more about me
              </Link>
              <Link
                prefetch={true}
                href="/projects"
                className="aero-button aero-button-secondary"
              >
                <img src={windows7Icons.projects} alt="" />
                my projects
              </Link>
            </nav>
            <p className="desktop-hint">
              Open a shortcut or choose an app from the taskbar.
            </p>
          </div>
        </div>
        <div className="window-status">
          <span>Ready</span>
          <span>4 pages · {projectCount} projects</span>
        </div>
      </AeroWindow>
    </main>
  );
}
