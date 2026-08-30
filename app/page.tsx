import { buttonVariants } from '@/components/ui/button';
import ASCIIText from '@/components/ascii-text';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="landing-frame relative isolate">
      <div
        data-aifx="ascii"
        data-aifx-colors="#0e394a,#2f80d9,#c9f0ff"
        data-aifx-speed="1.2"
        data-aifx-cell-size="21"
        data-aifx-scale="1.62"
        data-aifx-glow="0.2"
        data-aifx-flicker="0.23"
        data-aifx-contrast="0.85"
        data-aifx-scanlines="0.18"
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <section className="landing-content" aria-labelledby="landing-title">
        <div className="landing-title-wrap">
          <h1 id="landing-title" className="landing-title-accessible">
            Manav
          </h1>
          <div className="landing-ascii" aria-hidden="true">
            <ASCIIText
              text="Manav"
              enableWaves
              asciiFontSize={10}
              textFontSize={420}
              textColor="#fdf9f3"
              planeBaseHeight={18}
            />
          </div>
        </div>
        <p className="landing-tagline">a boy who loves tech</p>
        <nav className="landing-actions" aria-label="Explore Manav's portfolio">
          <a
            href="/about"
            className={cn(buttonVariants({ variant: 'default' }), 'retro-button')}
          >
            know more about me
          </a>
          <a
            href="/projects"
            className={cn(buttonVariants({ variant: 'outline' }), 'retro-button')}
          >
            my projects
          </a>
        </nav>
      </section>
    </main>
  );
}
