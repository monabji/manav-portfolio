type PortfolioHeaderProps = {
  current: 'about' | 'projects';
};

export function PortfolioHeader({ current }: PortfolioHeaderProps) {
  return (
    <header className="site-header">
      <a href="/" className="site-brand" aria-label="Manav, back to home">
        MANAV<span>/FOLIO</span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="/about" aria-current={current === 'about' ? 'page' : undefined}>
          about
        </a>
        <a
          href="/projects"
          aria-current={current === 'projects' ? 'page' : undefined}
        >
          projects
        </a>
      </nav>
    </header>
  );
}
