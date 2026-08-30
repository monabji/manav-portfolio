import Link from 'next/link';

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
          <Link
            href="/about"
            className={cn(buttonVariants({ variant: 'default' }), 'retro-button')}
          >
            know more about me
          </Link>
          <Link
            href="/projects"
            className={cn(buttonVariants({ variant: 'outline' }), 'retro-button')}
          >
            my projects
          </Link>
        </nav>
      </section>
    </main>
  );
}
