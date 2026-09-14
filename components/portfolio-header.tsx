import { FolderOpen, UserRound } from 'lucide-react';

type PortfolioHeaderProps = {
  current: 'about' | 'projects';
};

export function PortfolioHeader({ current }: PortfolioHeaderProps) {
  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <a href="/" className="site-brand" aria-label="Manav, back to home">
          <span className="brand-bubble" aria-hidden="true">M</span>
          <span>Manav <small>/ folio</small></span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="/about" aria-current={current === 'about' ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true"><UserRound /></span>
            <span>About</span>
          </a>
          <a href="/projects" aria-current={current === 'projects' ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true"><FolderOpen /></span>
            <span>Projects</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
