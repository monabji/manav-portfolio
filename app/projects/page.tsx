import type { Metadata } from 'next';
import { ArrowUpRight, Code2, ExternalLink } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHeader } from '@/components/portfolio-header';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Software, game development, hardware, AI, and 3D design projects by Manav Bhavin Soni.',
};

const softwareProjects = [
  {
    index: '01',
    title: 'CarWars',
    status: 'SHIPPED',
    className: 'tint-sage',
    description:
      'A PSX-style car game built from the ground up with Unity and original Blender assets, showcased at the Gravitas Expo.',
    tags: ['UNITY', 'BLENDER', 'GAME DEV'],
    links: [{ label: 'Source', href: 'https://github.com/ACM-VIT/carwars', kind: 'github' }],
  },
  {
    index: '02',
    title: 'AI Retinopathy Grading',
    status: 'IN PROGRESS',
    className: 'tint-salmon',
    description:
      'An AI project in progress for detecting and grading diabetic retinopathy from retinal imagery using the IDRiD dataset.',
    tags: ['PYTHON', 'AI / ML', 'HEALTHTECH'],
    links: [
      { label: 'Source', href: 'https://github.com/monabji/idrid-dr-grading', kind: 'github' },
    ],
  },
  {
    index: '03',
    title: 'Hackathon Winners Library',
    status: 'WEB',
    className: 'tint-peach',
    description:
      'A focused website for tracking hackathon winners and collecting standout builds in one browsable library.',
    tags: ['WEB', 'DATABASE', 'HACKATHONS'],
    links: [
      {
        label: 'Source',
        href: 'https://github.com/monabji/hackathon-winners-library',
        kind: 'github',
      },
      {
        label: 'Live site',
        href: 'https://hackathon-winners-library.vercel.app/',
        kind: 'external',
      },
    ],
  },
  {
    index: '04',
    title: 'UDID Saathi',
    status: 'PROTOTYPE',
    className: 'tint-lime',
    description:
      'An accessible citizen-service redesign for India’s UDID journey - applications, corrections, appointments, renewals, and progress tracking - for the Build For India hackathon.',
    tags: ['REACT', 'TYPESCRIPT', 'ACCESSIBILITY'],
    links: [
      { label: 'Live site', href: 'https://build-for-india-main.vercel.app/', kind: 'external' },
      { label: 'Source', href: 'https://github.com/monabji/build-for-india', kind: 'github' },
    ],
  },
  {
    index: '05',
    title: 'Tonoclear',
    status: '3RD PLACE',
    className: 'tint-periwinkle',
    description:
      'A hardware + IoT build created for the ACEi Hackathon in Chennai. The project took third place.',
    tags: ['HARDWARE', 'IOT', 'HACKATHON'],
    links: [
      {
        label: 'View deck',
        href: 'https://docs.google.com/presentation/d/1qWeE5ZlsOR0pKk2-CBKRMkFW9mXUaIu1w1aE0Wzf25I/edit?usp=sharing',
        kind: 'external',
      },
    ],
  },
];

const designProjects = [
  {
    title: 'Skull Landscape',
    category: 'LANDSCAPES / BLENDER',
    image: '/work/skull-landscape.png',
    alt: 'A Blender render of a skull in a rocky landscape with shallow depth of field',
    description: 'Natural textures, depth of field, and a cinematic environmental composition.',
  },
  {
    title: 'Liminal Pool',
    category: 'LANDSCAPES / BLENDER',
    image: '/work/liminal-pool.png',
    alt: 'A liminal indoor swimming pool rendered in Blender',
    description: 'An atmospheric interior study built around reflections and spatial lighting.',
  },
  {
    title: 'Flooded Tunnel',
    category: 'LANDSCAPES / BLENDER',
    image: '/work/flooded-tunnel.png',
    alt: 'A moody flooded tunnel environment rendered in Blender',
    description: 'Repetition, water, and subdued lighting create an immersive architectural scene.',
  },
  {
    title: 'Fog City',
    category: 'GAME MAP DESIGN',
    image: '/work/game-map.png',
    alt: 'A foggy, abandoned-looking city block designed as a game map',
    description: 'A quiet urban block with worn buildings, dim streetlights, and an uneasy mood.',
  },
  {
    title: 'Procedural Planet',
    category: 'NODES / BLENDER',
    image: '/work/procedural-planet.png',
    alt: 'A blue procedural planet with cloud detail against a black background',
    description: 'Layered noise and shader nodes create scalable terrain, clouds, and atmosphere.',
  },
  {
    title: 'Board Game Assets',
    category: 'ASSETS / BLENDER',
    image: '/work/dice-assets.png',
    alt: 'A colorful Blender render of a die surrounded by board game pawns',
    description: 'A playful modeling and materials study using simple, readable forms.',
  },
];

function ProjectLink({
  href,
  label,
  kind,
}: {
  href: string;
  label: string;
  kind: string;
}) {
  const Icon = kind === 'github' ? Code2 : ExternalLink;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon aria-hidden="true" />
      {label}
    </a>
  );
}

export default function ProjectsPage() {
  return (
    <main className="site-frame">
      <PortfolioHeader current="projects" />

      <div className="page-container">
        <section className="page-title-block tint-salmon" aria-labelledby="projects-title">
          <p className="eyebrow">SELECTED WORK / 2025-NOW</p>
          <h1 id="projects-title">MY PROJECTS</h1>
        </section>

        <section className="projects-section" aria-labelledby="builds-heading">
          <div className="projects-section-head">
            <div>
              <p className="section-kicker">CODE / GAMES / HARDWARE</p>
              <h2 id="builds-heading">Things I’ve built</h2>
            </div>
            <p>Experiments that became prototypes, games, and working products.</p>
          </div>

          <div className="software-grid">
            {softwareProjects.map((project) => (
              <Card className={`software-card ${project.className}`} key={project.title}>
                <CardHeader className="software-card-header">
                  <p className="project-index">{project.index}</p>
                  <span className="project-status">{project.status}</span>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="software-card-content">
                  <p>{project.description}</p>
                  <ul aria-label={`${project.title} technologies`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="project-links">
                  {project.links.map((link) => (
                    <ProjectLink key={`${project.title}-${link.label}`} {...link} />
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="projects-section design-section" aria-labelledby="design-heading">
          <div className="projects-section-head">
            <div>
              <p className="section-kicker">3D / ENVIRONMENTS / ASSETS</p>
              <h2 id="design-heading">Design work</h2>
            </div>
            <a
              className="archive-link"
              href="https://special-goat-5c6.notion.site/My-Portfolio-Manav-Bhavin-Soni-2e2e42723d8f802da4fdee6434d0d53c"
              target="_blank"
              rel="noreferrer"
            >
              Full showcase <ArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <div className="design-grid">
            {designProjects.map((project, index) => (
              <article className={index === 0 ? 'design-card design-card-wide' : 'design-card'} key={project.title}>
                <img src={project.image} alt={project.alt} loading={index > 1 ? 'lazy' : 'eager'} />
                <div className="design-card-caption">
                  <p>{project.category}</p>
                  <h3>{project.title}</h3>
                  <span>{project.description}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>MORE WORK IS ALWAYS ON THE WAY.</span>
        <a href="mailto:manav.bhavinsoni2025@vitstudent.ac.in">
          SAY HELLO <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}
