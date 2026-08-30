import { buttonVariants } from '@/components/ui/button';
import ASCIIText from '@/components/ascii-text';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="landing-frame">
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
              textColor="#f1be22"
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
