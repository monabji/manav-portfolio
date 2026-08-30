import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="landing-frame">
      <section className="landing-content" aria-labelledby="landing-title">
        <h1 id="landing-title" className="landing-title">
          Manav
        </h1>
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
