'use client';

import { useState } from 'react';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';

const education = [
  ['2025 - 2029', 'B.Tech, Computer Science & Engineering (Core)', 'VIT University, Vellore Campus'],
  ['12th grade', 'Senior Secondary Education', 'Allen Career Institute, Bangalore'],
  ['10th grade', 'Secondary Education', 'Freedom International School, Bangalore'],
];

const tabs = ['Overview', 'Education', 'Skills', 'Experience', 'Connect'] as const;
type Tab = typeof tabs[number];

export function AboutWindow() {
  const [tab, setTab] = useState<Tab>('Overview');
  const sound = useAeroSound();
  const selectTab = (next: Tab) => { setTab(next); sound('select'); };

  return (
    <AeroWindow title="About Manav" icon="/aero/profile.png" className="content-window">
      <div className="window-toolbar">
        <button type="button" onClick={() => history.back()} aria-label="Go back">‹</button>
        <button type="button" onClick={() => history.forward()} aria-label="Go forward">›</button>
        <div className="address-bar"><img src="/aero/profile.png" alt="" /><span>Manav OS</span><b>›</b><strong>About me</strong></div>
      </div>
      <div className="aero-tabs" role="tablist" aria-label="About sections">
        {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => selectTab(item)}>{item}</button>)}
      </div>
      <div className="about-app-body">
        <aside className="about-profile-card">
          <div className="profile-orb"><img src="/aero/profile.png" alt="A glossy profile icon" /></div>
          <h1>Hi! I&apos;m Manav!</h1>
          <p>A student at VIT Vellore and I just love messing around in tech.</p>
          <div className="interest-pills"><span>GameDev</span><span>3D Design</span><span>AI/ML</span><span>Cybersecurity</span></div>
          <p>Feel free to reach out!</p>
        </aside>
        <div className="tab-canvas" role="tabpanel" aria-label={tab}>
          {(tab === 'Overview' || tab === 'Education') && (
            <section className="app-section education-app">
              <div className="app-section-title"><img src="/aero/home.png" alt="" /><div><span>LEARNING JOURNEY</span><h2>Education</h2></div></div>
              <div className="timeline">
                {education.map(([years, qualification, institution]) => <article key={qualification}><time>{years}</time><div><h3>{qualification}</h3><p>{institution}</p></div></article>)}
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Skills') && (
            <section className="app-section skills-app">
              <div className="app-section-title"><img src="/aero/browser.png" alt="" /><div><span>TOOLBOX</span><h2>Technical skills</h2></div></div>
              <div className="meter-list">
                <div><strong>Languages</strong><p>C, C++, Python, Lua, GDScript, HTML, CSS</p><span><i style={{width:'88%'}} /></span></div>
                <div><strong>Development</strong><p>Bots, websites, and AI-based projects using Python</p><span><i style={{width:'76%'}} /></span></div>
                <div><strong>Practice</strong><p>HackerRank, Codeforces, CTFs</p><span><i style={{width:'67%'}} /></span></div>
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Experience') && (
            <section className="app-section experience-app">
              <div className="app-section-title"><img src="/aero/games.png" alt="" /><div><span>CURRENT ROLES</span><h2>Experience</h2></div></div>
              <div className="experience-tiles">
                <article><img src="/experience/acm.png" alt="Association for Computing Machinery logo" /><div><h3>Core Member</h3><p>Association for Computing Machinery (ACM)</p></div></article>
                <article><img src="/experience/toastmasters.png" alt="Toastmasters International logo" /><div><h3>Vice President - PR</h3><p>Nuvens Toastmasters International</p></div></article>
              </div>
            </section>
          )}
          {(tab === 'Overview' || tab === 'Connect') && (
            <section className="app-section connect-app">
              <div className="app-section-title"><img src="/aero/email.png" alt="" /><div><span>CONTACTS</span><h2>Find me online</h2></div></div>
              <div className="contact-tiles">
                <a href="https://github.com/monabji" target="_blank" rel="noreferrer"><span className="contact-glyph">GH</span><div><strong>GitHub</strong><small>@monabji</small></div><b>↗</b></a>
                <a href="https://in.linkedin.com/in/manav-soni-310784375" target="_blank" rel="noreferrer"><span className="contact-glyph">in</span><div><strong>LinkedIn</strong><small>Manav Soni</small></div><b>↗</b></a>
                <a href="mailto:manav.bhavinsoni2025@vitstudent.ac.in"><img src="/aero/email.png" alt="" /><div><strong>Email</strong><small>manav.bhavinsoni2025@vitstudent.ac.in</small></div><b>↗</b></a>
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="window-status"><span>{tab}</span><span>{tab === 'Overview' ? '4 sections' : '1 section'} · Manav&apos;s profile</span></div>
    </AeroWindow>
  );
}
