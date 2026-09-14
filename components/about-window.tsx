'use client';

import { useState } from 'react';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';
import { aboutTabs, crystalIcons, education, experience, skills, socialLinks, type AboutTab } from '@/config/portfolio';

export function AboutWindow() {
  const [tab, setTab] = useState<AboutTab>('Overview');
  const sound = useAeroSound();
  const selectTab = (next: AboutTab) => { setTab(next); sound('select'); };

  return (
    <AeroWindow title="About Manav" icon={crystalIcons.profile} className="content-window">
      <div className="window-toolbar">
        <button type="button" onClick={() => history.back()} aria-label="Go back">‹</button>
        <button type="button" onClick={() => history.forward()} aria-label="Go forward">›</button>
        <div className="address-bar"><img src={crystalIcons.profile} alt="" /><span>Manav OS</span><b>›</b><strong>About me</strong></div>
      </div>
      <div className="aero-tabs" role="tablist" aria-label="About sections">
        {aboutTabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => selectTab(item)}>{item}</button>)}
      </div>
      <div className="about-app-body">
        <aside className="about-profile-card">
          <div className="profile-orb"><img src={crystalIcons.profile} alt="A glossy Crystal Project browser icon" /></div>
          <h1>Hi! I&apos;m Manav!</h1>
          <p>A student at VIT Vellore and I just love messing around in tech.</p>
          <div className="interest-pills"><span>GameDev</span><span>3D Design</span><span>AI/ML</span><span>Cybersecurity</span></div>
          <p>Feel free to reach out!</p>
        </aside>
        <div className="tab-canvas" role="tabpanel" aria-label={tab}>
          {(tab === 'Overview' || tab === 'Education') && (
            <section className="app-section education-app">
              <div className="app-section-title"><img src={crystalIcons.home} alt="" /><div><span>LEARNING JOURNEY</span><h2>Education</h2></div></div>
              <div className="timeline">
                {education.map(({ years, qualification, institution }) => <article key={qualification}><time>{years}</time><div><h3>{qualification}</h3><p>{institution}</p></div></article>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Skills') && (
            <section className="app-section skills-app">
              <div className="app-section-title"><img src={crystalIcons.code} alt="" /><div><span>TOOLBOX</span><h2>Technical skills</h2></div></div>
              <div className="meter-list">
                {skills.map((skill) => <div key={skill.label}><strong>{skill.label}</strong><p>{skill.detail}</p><span><i style={{ width: skill.level }} /></span></div>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Experience') && (
            <section className="app-section experience-app">
              <div className="app-section-title"><img src={crystalIcons.projects} alt="" /><div><span>CURRENT ROLES</span><h2>Experience</h2></div></div>
              <div className="experience-tiles">
                {experience.map((item) => <article key={item.organization}><img src={item.logo} alt={item.alt} /><div><h3>{item.role}</h3><p>{item.organization}</p></div></article>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Connect') && (
            <section className="app-section connect-app">
              <div className="app-section-title"><img src={crystalIcons.browser} alt="" /><div><span>CONTACTS</span><h2>Find me online</h2></div></div>
              <div className="contact-tiles">
                {socialLinks.map((link) => <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>{'icon' in link ? <img src={link.icon} alt="" /> : <span className="contact-glyph">{link.glyph}</span>}<div><strong>{link.label}</strong><small>{link.detail}</small></div><b>↗</b></a>)}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="window-status"><span>{tab}</span><span>{tab === 'Overview' ? '4 sections' : '1 section'} · Manav&apos;s profile</span></div>
    </AeroWindow>
  );
}
