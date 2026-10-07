'use client';

import { useState } from 'react';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';
import { ExplorerSidebar, explorerIcons } from './window-chrome';
import { aboutTabs, achievements, crystalIcons, education, skills, socialLinks, type AboutTab } from '@/config/portfolio';
import { useDesktopSettings } from './desktop-settings';

export function AboutWindow() {
  const { settings: { experience } } = useDesktopSettings();
  const [tab, setTab] = useState<AboutTab>('Overview');
  const sound = useAeroSound();
  const selectTab = (next: AboutTab) => { setTab(next); sound('select'); };

  return (
    <AeroWindow title="About Manav" icon={crystalIcons.profile} className="content-window" hasSidebar breadcrumbs={[{ label: 'About me' }, { label: tab }]}>
      <div className="aero-tabs" role="tablist" aria-label="About sections">
        {aboutTabs.map((item, index) => <button key={item} id={`about-tab-${item}`} type="button" role="tab" aria-controls="about-panel" tabIndex={tab === item ? 0 : -1} aria-selected={tab === item} onClick={() => selectTab(item)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? aboutTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + aboutTabs.length) % aboutTabs.length; selectTab(aboutTabs[next]); document.getElementById(`about-tab-${aboutTabs[next]}`)?.focus(); } }}>{item}</button>)}
      </div>
      <div className="about-app-body">
        <ExplorerSidebar><div className="sidebar-group"><strong><img src={explorerIcons.documents} alt="" />Profile</strong>{aboutTabs.map(item => <button key={item} type="button" className={tab === item ? 'is-active' : ''} onClick={() => selectTab(item)}><img src={explorerIcons.documents} alt="" />{item}</button>)}</div></ExplorerSidebar>
        <div className="tab-canvas has-scrollbar" id="about-panel" role="tabpanel" aria-labelledby={`about-tab-${tab}`} tabIndex={0}>
        <section className="about-profile-card">
          <div className="profile-orb"><img src={crystalIcons.profile} alt="People profile icon" /></div>
          <h1>Hi! I&apos;m Manav!</h1>
          <p>A Computer Science student at VIT Vellore who loves messing around in tech. I build machine learning, healthcare simulation, database and game-development projects, from early prototypes to hackathon demonstrations.</p>
          <div className="interest-pills"><span>GameDev</span><span>3D Design</span><span>AI/ML</span><span>Cybersecurity</span></div>
          <p>Feel free to reach out!</p>
        </section>
          {(tab === 'Overview' || tab === 'Education') && (
            <section className="app-section education-app">
              <div className="app-section-title"><img src={crystalIcons.home} alt="" /><div><span>LEARNING JOURNEY</span><h2>Education</h2></div></div>
              <div className="timeline">
                {education.map(item => <article key={item.qualification}><time>{item.years}</time><div><h3>{item.qualification}</h3><p>{item.institution}</p>{'detail' in item && <p className="coursework">{item.detail}</p>}</div></article>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Skills') && (
            <section className="app-section skills-app">
              <div className="app-section-title"><img src={crystalIcons.code} alt="" /><div><span>TOOLBOX</span><h2>Technical skills</h2></div></div>
              <dl className="skills-list">
                {skills.map(skill => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.detail}</dd></div>)}
              </dl>
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
                {socialLinks.map((link) => <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}><img src={link.icon} alt="" /><div><strong>{link.label}</strong><small>{link.detail}</small></div><b>↗</b></a>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Education') && (
            <section className="app-section achievements-app">
              <div className="app-section-title"><img src={crystalIcons.projects} alt="" /><div><h2>Achievements</h2></div></div>
              <ul className="achievements-list">{achievements.map(item => <li key={item.title}><strong>{item.title}</strong><p>{item.detail}</p></li>)}</ul>
            </section>
          )}
        </div>
      </div>
      <div className="window-status"><span>{tab}</span><span>{tab === 'Overview' ? '5 sections' : tab === 'Education' ? '2 sections' : '1 section'} · Manav&apos;s profile</span></div>
    </AeroWindow>
  );
}
