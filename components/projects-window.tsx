'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';
import { ExplorerChrome, ExplorerSidebar, WindowTitlebar, explorerIcons } from './window-chrome';
import { crystalIcons, type Project } from '@/config/portfolio';
import { useDesktopSettings } from './desktop-settings';

export function ProjectsWindow() {
  const { settings: { softwareProjects, designProjects }, ready } = useDesktopSettings();
  const [tab, setTab] = useState<'software'|'design'>('software');
  const [selected, setSelected] = useState<Project|null>(null);
  const [detailMaximized, setDetailMaximized] = useState(false);
  const [detailMinimized, setDetailMinimized] = useState(false);
  const sound = useAeroSound();

  useEffect(() => {
    if (!ready) return;
    const slug = new URLSearchParams(window.location.search).get('project');
    const project = [...softwareProjects, ...designProjects].find(item => item.title.toLowerCase().replaceAll(' ', '-') === slug);
    setSelected(project || null);
    if (project) setTab(designProjects.includes(project) ? 'design' : 'software');
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelected(null); setDetailMinimized(false); history.replaceState(null, '', '/projects'); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [ready, softwareProjects, designProjects]);

  const openProject = (project: Project) => { setSelected(project); setDetailMaximized(false); setDetailMinimized(false); sound('open'); history.replaceState(null, '', `/projects?project=${encodeURIComponent(project.title.toLowerCase().replaceAll(' ','-'))}`); };
  const closeProject = () => { setSelected(null); setDetailMinimized(false); sound('close'); history.replaceState(null, '', '/projects'); };

  return (
    <AeroWindow title="Manav's Project Explorer" icon={crystalIcons.projects} className="content-window projects-window" hasSidebar breadcrumbs={[{ label: 'Projects' }, { label: tab === 'software' ? 'Things I built' : '3D showcase' }]}>
      <div className="projects-app-body">
        <ExplorerSidebar><div className="sidebar-group"><strong><img src={explorerIcons.folder} alt="" />My projects</strong><button className={tab==='software'?'is-active':''} type="button" onClick={() => {setTab('software');sound('select')}}><img src={crystalIcons.code} alt="" />Things I built</button><button className={tab==='design'?'is-active':''} type="button" onClick={() => {setTab('design');sound('select')}}><img src={crystalIcons.blender} alt="" />3D showcase</button><a href="https://special-goat-5c6.notion.site/My-Portfolio-Manav-Bhavin-Soni-2e2e42723d8f802da4fdee6434d0d53c" target="_blank" rel="noreferrer"><img src={explorerIcons.pictures} alt="" />Full showcase</a></div></ExplorerSidebar>
        <section className="explorer-content has-scrollbar" aria-live="polite">
          <div className="explorer-heading"><div><span>{tab==='software'?'CODE · GAMES · HARDWARE':'3D · ENVIRONMENTS · ASSETS'}</span><h2>{tab==='software'?'Things I’ve built':'Design work'}</h2></div><em>{tab === 'software' ? softwareProjects.length : designProjects.length} items</em></div>
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
      <div className="window-status"><span>{tab === 'software' ? `${softwareProjects.length} projects` : `${designProjects.length} images`}</span>{selected && detailMinimized ? <button className="explorer-menu-button" type="button" onClick={() => setDetailMinimized(false)}>Restore {selected.title}</button> : <span>Select an item to open it</span>}</div>
      {selected && !detailMinimized && createPortal(
        <div className="detail-backdrop" role="presentation" onMouseDown={(event) => {if(event.target===event.currentTarget) closeProject()}}>
          <section className={`window glass active is-bright aero-window detail-window ${detailMaximized ? 'is-detail-maximized' : ''}`} role="dialog" aria-modal="true" aria-label={selected.title}>
            <WindowTitlebar title={selected.title} icon={selected.icon} onClose={closeProject} onMinimize={() => setDetailMinimized(true)} maximized={detailMaximized} onMaximize={() => setDetailMaximized(value => !value)} onDoubleClick={() => setDetailMaximized(value => !value)} />
            <div className="window-interior">
            <ExplorerChrome title={selected.title} icon={selected.icon} breadcrumbs={[{ label: 'Projects', onClick: closeProject }, { label: selected.title }]} />
            <div className="detail-scroll has-scrollbar">
            {selected.image && <img className="detail-hero" src={selected.image} alt={selected.alt} />}
            <div className="detail-content"><span className="detail-status">{selected.status}</span><h2>{selected.title}</h2><p>{selected.description}</p><ul>{selected.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>{selected.links.length>0&&<div className="detail-links">{selected.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}</div>
            </div><footer><button type="button" onClick={closeProject}>Close</button></footer>
            </div>
          </section>
        </div>, document.body
      )}
    </AeroWindow>
  );
}
