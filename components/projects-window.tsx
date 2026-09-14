'use client';

import { useEffect, useState } from 'react';
import { AeroWindow } from './aero-window';
import { useAeroSound } from './desktop-shell';

type Project = { title:string; status:string; description:string; tags:string[]; links:{label:string;href:string}[]; image?:string; alt?:string; category?:string };

const software: Project[] = [
  { title:'CarWars', status:'Shipped', description:'A PSX-style car game built from the ground up with Unity and original Blender assets, showcased at the Gravitas Expo.', tags:['Unity','Blender','Game development'], links:[{label:'Open source code',href:'https://github.com/ACM-VIT/carwars'}] },
  { title:'AI Retinopathy Grading', status:'In progress', description:'An AI project in progress for detecting and grading diabetic retinopathy from retinal imagery using the IDRiD dataset.', tags:['Python','AI / ML','Healthtech'], links:[{label:'Open source code',href:'https://github.com/monabji/idrid-dr-grading'}] },
  { title:'Hackathon Winners Library', status:'Live website', description:'A focused website for tracking hackathon winners and collecting standout builds in one browsable library.', tags:['Web','Database','Hackathons'], links:[{label:'Visit website',href:'https://hackathon-winners-library.vercel.app/'},{label:'Open source code',href:'https://github.com/monabji/hackathon-winners-library'}] },
  { title:'UDID Saathi', status:'Prototype', description:'An accessible citizen-service redesign for India’s UDID journey: applications, corrections, appointments, renewals, and progress tracking for the Build For India hackathon.', tags:['React','TypeScript','Accessibility'], links:[{label:'Visit website',href:'https://build-for-india-main.vercel.app/'},{label:'Open source code',href:'https://github.com/monabji/build-for-india'}] },
  { title:'Tonoclear', status:'3rd place', description:'A hardware and IoT build created for the ACEi Hackathon in Chennai. The project took third place.', tags:['Hardware','IoT','Hackathon'], links:[{label:'View presentation',href:'https://docs.google.com/presentation/d/1qWeE5ZlsOR0pKk2-CBKRMkFW9mXUaIu1w1aE0Wzf25I/edit?usp=sharing'}] },
];

const designs: Project[] = [
  {title:'Skull Landscape',status:'Blender',category:'Landscapes / Blender',image:'/work/skull-landscape.png',alt:'A Blender render of a skull in a rocky landscape with shallow depth of field',description:'Natural textures, depth of field, and a cinematic environmental composition.',tags:['3D','Environment'],links:[]},
  {title:'Liminal Pool',status:'Blender',category:'Landscapes / Blender',image:'/work/liminal-pool.png',alt:'A liminal indoor swimming pool rendered in Blender',description:'An atmospheric interior study built around reflections and spatial lighting.',tags:['3D','Lighting'],links:[]},
  {title:'Flooded Tunnel',status:'Blender',category:'Landscapes / Blender',image:'/work/flooded-tunnel.png',alt:'A moody flooded tunnel environment rendered in Blender',description:'Repetition, water, and subdued lighting create an immersive architectural scene.',tags:['3D','Environment'],links:[]},
  {title:'Fog City',status:'Game map',category:'Game map design',image:'/work/game-map.png',alt:'A foggy, abandoned-looking city block designed as a game map',description:'A quiet urban block with worn buildings, dim streetlights, and an uneasy mood.',tags:['Game map','Worldbuilding'],links:[]},
  {title:'Procedural Planet',status:'Blender',category:'Nodes / Blender',image:'/work/procedural-planet.png',alt:'A blue procedural planet with cloud detail against a black background',description:'Layered noise and shader nodes create scalable terrain, clouds, and atmosphere.',tags:['Shaders','Nodes'],links:[]},
  {title:'Board Game Assets',status:'Blender',category:'Assets / Blender',image:'/work/dice-assets.png',alt:'A colorful Blender render of a die surrounded by board game pawns',description:'A playful modeling and materials study using simple, readable forms.',tags:['Assets','Materials'],links:[]},
];

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
    <AeroWindow title="Manav's Project Explorer" icon="/aero/games.png" className="content-window projects-window">
      <div className="window-toolbar">
        <button type="button" onClick={() => history.back()} aria-label="Go back">‹</button><button type="button" onClick={() => history.forward()} aria-label="Go forward">›</button>
        <div className="address-bar"><img src="/aero/home.png" alt="" /><span>Manav OS</span><b>›</b><strong>Projects</strong><b>›</b><span>{tab === 'software' ? 'Things I built' : '3D showcase'}</span></div>
        <a className="showcase-link" aria-label="Open full 3D showcase" href="https://special-goat-5c6.notion.site/My-Portfolio-Manav-Bhavin-Soni-2e2e42723d8f802da4fdee6434d0d53c" target="_blank" rel="noreferrer">Full showcase ↗</a>
      </div>
      <div className="projects-app-body">
        <aside className="explorer-sidebar" aria-label="Project categories">
          <h1>My projects</h1><p>Experiments that became prototypes, games, and working products.</p>
          <button className={tab==='software'?'is-active':''} type="button" onClick={() => {setTab('software');sound('select')}}><img src="/aero/games.png" alt="" /><span><strong>Things I built</strong><small>5 projects</small></span></button>
          <button className={tab==='design'?'is-active':''} type="button" onClick={() => {setTab('design');sound('select')}}><img src="/aero/browser.png" alt="" /><span><strong>3D showcase</strong><small>6 renders</small></span></button>
          <div className="sidebar-tip"><b>Tip</b><span>Open an item to see its details.</span></div>
        </aside>
        <section className="explorer-content" aria-live="polite">
          <div className="explorer-heading"><div><span>{tab==='software'?'CODE · GAMES · HARDWARE':'3D · ENVIRONMENTS · ASSETS'}</span><h2>{tab==='software'?'Things I’ve built':'Design work'}</h2></div><em>{tab==='software'?'5 items':'6 items'}</em></div>
          {tab === 'software' ? (
            <div className="project-icon-grid">
              {software.map((project,index) => <button key={project.title} type="button" onClick={() => openProject(project)}><span className={`project-file-icon tint-${index+1}`}><img src={index===2?'/aero/browser.png':'/aero/games.png'} alt="" /></span><strong>{project.title}</strong><small>{project.status}</small></button>)}
            </div>
          ) : (
            <div className="gallery-grid">
              {designs.map((project) => <button key={project.title} type="button" onClick={() => openProject(project)}><img src={project.image} alt={project.alt} /><span><strong>{project.title}</strong><small>{project.category}</small></span></button>)}
            </div>
          )}
        </section>
      </div>
      <div className="window-status"><span>{tab === 'software' ? '5 projects' : '6 images'}</span><span>Select an item to open it</span></div>
      {selected && (
        <div className="detail-backdrop" role="presentation" onMouseDown={(event) => {if(event.target===event.currentTarget) closeProject()}}>
          <section className="detail-window" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <header className="window-titlebar"><div className="window-title"><img src={selected.image || '/aero/games.png'} alt="" /><span id="detail-title">{selected.title}</span></div><div className="window-controls"><button type="button" onClick={closeProject} aria-label={`Close ${selected.title}`}>×</button></div></header>
            {selected.image && <img className="detail-hero" src={selected.image} alt={selected.alt} />}
            <div className="detail-content"><span className="detail-status">{selected.status}</span><h2>{selected.title}</h2><p>{selected.description}</p><ul>{selected.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>{selected.links.length>0&&<div className="detail-links">{selected.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}</div>
            <footer><button type="button" onClick={closeProject}>Close</button></footer>
          </section>
        </div>
      )}
    </AeroWindow>
  );
}
