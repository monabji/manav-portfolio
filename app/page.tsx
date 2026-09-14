export default function Home() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-glass-panel">
          <span className="landing-gloss" aria-hidden="true" />
          <div className="landing-copy">
            <h1 id="landing-title">Manav</h1>
            <p>a boy who loves tech.</p>
            <nav className="landing-actions" aria-label="Explore Manav's portfolio">
              <a href="/about" className="aero-button aero-button-primary">
                know more about me
              </a>
              <a href="/projects" className="aero-button aero-button-secondary">
                my projects
              </a>
            </nav>
          </div>
          <div className="landing-waterline" aria-hidden="true" />
        </div>
        <div className="landing-orb" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
