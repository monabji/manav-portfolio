import Link from 'next/link';

type PortfolioHeaderProps = {
  current: 'about' | 'projects';
};

export function PortfolioHeader({ current }: PortfolioHeaderProps) {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand" aria-label="Manav, back to home">
        MANAV<span>/FOLIO</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/about" aria-current={current === 'about' ? 'page' : undefined}>
          about
        </Link>
        <Link
          href="/projects"
          aria-current={current === 'projects' ? 'page' : undefined}
        >
          projects
        </Link>
      </nav>
    </header>
  );
}
