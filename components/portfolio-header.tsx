import { FolderOpen, UserRound } from 'lucide-react';
import Link from 'next/link';

type PortfolioHeaderProps = {
  current: 'about' | 'projects';
};

export function PortfolioHeader({ current }: PortfolioHeaderProps) {
  return (
    <header className="site-header-wrap">
      <div className="site-header">
        <Link href="/" className="site-brand" aria-label="Manav, back to home">
          <span className="brand-bubble" aria-hidden="true">M</span>
          <span>Manav <small>/ folio</small></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/about" aria-current={current === 'about' ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true"><UserRound /></span>
            <span>About</span>
          </Link>
          <Link href="/projects" aria-current={current === 'projects' ? 'page' : undefined}>
            <span className="nav-icon" aria-hidden="true"><FolderOpen /></span>
            <span>Projects</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
