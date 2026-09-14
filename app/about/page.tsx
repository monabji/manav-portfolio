import type { Metadata } from 'next';
import { ArrowUpRight, Code2, Mail, Network } from 'lucide-react';

import { PortfolioHeader } from '@/components/portfolio-header';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Manav Bhavin Soni, a computer science student, aspiring 3D designer, and game developer.',
};

const education = [
  {
    years: '2025 - 2029',
    qualification: 'B.Tech, Computer Science & Engineering (Core)',
    institution: 'VIT University, Vellore Campus',
  },
  {
    years: '12TH GRADE',
    qualification: 'Senior Secondary Education',
    institution: 'Allen Career Institute, Bangalore',
  },
  {
    years: '10TH GRADE',
    qualification: 'Secondary Education',
    institution: 'Freedom International School, Bangalore',
  },
];

const socialLinks = [
  {
    label: 'GitHub',
    detail: '@monabji',
    href: 'https://github.com/monabji',
    icon: Code2,
  },
  {
    label: 'LinkedIn',
    detail: 'Manav Soni',
    href: 'https://in.linkedin.com/in/manav-soni-310784375',
    icon: Network,
  },
  {
    label: 'Email',
    detail: 'manav.bhavinsoni2025@vitstudent.ac.in',
    href: 'mailto:manav.bhavinsoni2025@vitstudent.ac.in',
    icon: Mail,
  },
];

const experience = [
  {
    organisation: 'Association for Computing Machinery',
    role: 'Core Member',
    image: '/experience/acm.png',
  },
  {
    organisation: 'Nuvens Toastmasters International',
    role: 'Vice President - PR',
    image: '/experience/toastmasters.png',
  },
];

export default function AboutPage() {
  return (
    <main className="site-frame">
      <PortfolioHeader current="about" />

      <div className="page-container">
        <section className="page-hero" aria-labelledby="about-title">
          <span className="panel-gloss" aria-hidden="true" />
          <div className="page-hero-copy">
            <p className="eyebrow">Profile 01</p>
            <h1 id="about-title">Know more about me</h1>
            <p className="intro-copy">
              Hi! I&apos;m Manav! A student at VIT Vellore and I just love messing around in tech.
              I&apos;m Intrested in GameDev, 3D Desgin, AIML and Cybersecuriy. Feel free to reach out!
            </p>
          </div>
          <div className="page-hero-orb" aria-hidden="true"><span /></div>
        </section>

        <div className="about-layout">
          <div className="about-main-column">
            <section className="content-section aero-panel" aria-labelledby="education-heading">
              <div className="section-heading-row">
                <p className="section-number">01</p>
                <h2 id="education-heading">Education</h2>
              </div>
              <div className="education-list">
                {education.map((item) => (
                  <article className="education-row" key={item.qualification}>
                    <p className="education-years">{item.years}</p>
                    <div>
                      <h3>{item.qualification}</h3>
                      <p>{item.institution}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="experience-panel aero-panel" aria-labelledby="experience-heading">
              <div className="section-heading-row compact">
                <p className="section-number">03</p>
                <h2 id="experience-heading">Experience</h2>
              </div>
              <div className="experience-list">
                {experience.map(({ organisation, role, image }) => (
                  <article className="experience-row" key={organisation}>
                    <div className="organisation-mark" aria-hidden="true">
                      <img src={image} alt="" />
                    </div>
                    <div>
                      <h3>{role}</h3>
                      <p>{organisation}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="about-sidebar">
            <section className="skills-panel aero-panel" aria-labelledby="skills-heading">
              <div className="section-heading-row compact">
                <p className="section-number">02</p>
                <h2 id="skills-heading">Technical skills</h2>
              </div>
              <dl className="skills-list">
                <div>
                  <dt>Languages</dt>
                  <dd>C, C++, Python, Lua, GDScript, HTML, CSS</dd>
                </div>
                <div>
                  <dt>Development</dt>
                  <dd>Bots, websites, and AI-based projects using Python</dd>
                </div>
                <div>
                  <dt>Practice</dt>
                  <dd>HackerRank, Codeforces, CTFs</dd>
                </div>
              </dl>
            </section>

            <section className="social-panel aero-panel" aria-labelledby="social-heading">
              <div className="section-heading-row compact">
                <p className="section-number">04</p>
                <h2 id="social-heading">Find me online</h2>
              </div>
              <div className="social-list">
                {socialLinks.map(({ label, detail, href, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer">
                    <Icon aria-hidden="true" />
                    <span>
                      <strong>{label}</strong>
                      <small>{detail}</small>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

    </main>
  );
}
