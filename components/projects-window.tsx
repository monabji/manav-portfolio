'use client';

import { useEffect, useState } from 'react';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';
import { crystalIcons, designProjects, softwareProjects, type Project } from '@/config/portfolio';

export function ProjectsWindow() {
  const [tab, setTab] = useState<'software'|'design'>('software');
  const [selected, setSelected] = useState<Project|null>(null);
  const sound = useAeroSound();

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, []);

  const openProject = (project: Project) => { setSelected(project); sound('open'); history.replaceState(null, '', `/projects?project=${encodeURIComponent(project.title.toLowerCase().replaceAll(' ','-'))}`); };
  const closeProject = () => { setSelected(null); sound('close'); history.replaceState(null, '', '/projects'); };

  return (
    <AeroWindow title="Manav's Project Explorer" icon={crystalIcons.projects} className="content-window projects-window">
      <div className="window-toolbar">
        <button type="button" onClick={() => history.back()} aria-label="Go back">‹</button><button type="button" onClick={() => history.forward()} aria-label="Go forward">›</button>
        <div className="address-bar"><img src={crystalIcons.home} alt="" /><span>Manav OS</span><b>›</b><strong>Projects</strong><b>›</b><span>{tab === 'software' ? 'Things I built' : '3D showcase'}</span></div>
        <a className="showcase-link" aria-label="Open full 3D showcase" href="https://special-goat-5c6.notion.site/My-Portfolio-Manav-Bhavin-Soni-2e2e42723d8f802da4fdee6434d0d53c" target="_blank" rel="noreferrer">Full showcase ↗</a>
      </div>
      <div className="projects-app-body">
        <aside className="explorer-sidebar" aria-label="Project categories">
          <h1>My projects</h1><p>Experiments that became prototypes, games, and working products.</p>
          <button className={tab==='software'?'is-active':''} type="button" onClick={() => {setTab('software');sound('select')}}><img src={crystalIcons.code} alt="" /><span><strong>Things I built</strong><small>{softwareProjects.length} projects</small></span></button>
          <button className={tab==='design'?'is-active':''} type="button" onClick={() => {setTab('design');sound('select')}}><img src={crystalIcons.blender} alt="" /><span><strong>3D showcase</strong><small>{designProjects.length} renders</small></span></button>
          <div className="sidebar-tip"><b>Tip</b><span>Open an item to see its details.</span></div>
        </aside>
        <section className="explorer-content" aria-live="polite">
          <div className="explorer-heading"><div><span>{tab==='software'?'CODE · GAMES · HARDWARE':'3D · ENVIRONMENTS · ASSETS'}</span><h2>{tab==='software'?'Things I’ve built':'Design work'}</h2></div><em>{tab==='software'?'5 items':'6 items'}</em></div>
          {tab === 'software' ? (
            <div className="project-icon-grid">
              {softwareProjects.map((project,index) => <button key={project.title} type="button" onClick={() => openProject(project)}><span className={`project-file-icon tint-${index+1}`}><img src={project.icon} alt="" /></span><strong>{project.title}</strong><small>{project.status}</small></button>)}
            </div>
          ) : (
            <div className="gallery-grid">
              {designProjects.map((project) => <button key={project.title} type="button" onClick={() => openProject(project)}><img src={project.image} alt={project.alt} /><span><strong>{project.title}</strong><small>{project.category}</small></span></button>)}
            </div>
          )}
        </section>
      </div>
      <div className="window-status"><span>{tab === 'software' ? '5 projects' : '6 images'}</span><span>Select an item to open it</span></div>
      {selected && (
        <div className="detail-backdrop" role="presentation" onMouseDown={(event) => {if(event.target===event.currentTarget) closeProject()}}>
          <section className="detail-window" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <header className="window-titlebar"><div className="window-title"><img src={selected.image || selected.icon} alt="" /><span id="detail-title">{selected.title}</span></div><div className="window-controls"><button type="button" onClick={closeProject} aria-label={`Close ${selected.title}`}>×</button></div></header>
            {selected.image && <img className="detail-hero" src={selected.image} alt={selected.alt} />}
            <div className="detail-content"><span className="detail-status">{selected.status}</span><h2>{selected.title}</h2><p>{selected.description}</p><ul>{selected.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>{selected.links.length>0&&<div className="detail-links">{selected.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}</div>
            <footer><button type="button" onClick={closeProject}>Close</button></footer>
          </section>
        </div>
      )}
    </AeroWindow>
  );
}
