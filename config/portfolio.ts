export const crystalIcons = {
  home: '/crystal/network.png',
  profile: '/crystal/people.png',
  projects: '/crystal/projects.png',
  browser: '/crystal/browser.png',
  code: '/crystal/graphics.png',
  blender: '/crystal/blender.png',
  notepad: '/crystal/notepad.png',
  gamepad: '/crystal/gamepad.png',
  snake: '/crystal/ksnake.png',
  gallery: '/crystal/gallery.png',
  email: '/aero/email.png',
  music: '/crystal/sound.png',
  dashboard: '/crystal/graphics.png',
  sound: '/crystal/sound.png',
} as const;

export const desktopApps = [
  {
    href: '/',
    label: 'Home',
    icon: crystalIcons.home,
    description: 'Welcome screen',
  },
  {
    href: '/about',
    label: 'About me',
    icon: crystalIcons.profile,
    description: 'Education, skills and experience',
  },
  {
    href: '/projects',
    label: 'My projects',
    icon: crystalIcons.projects,
    description: 'Code, games and 3D work',
  },
  {
    href: '/dashboard',
    label: 'My dashboard',
    icon: crystalIcons.dashboard,
    description: 'Personal desktop settings',
  },
] as const;

export const desktopUtilities = [
  { id: 'notepad', label: 'Notepad', icon: crystalIcons.notepad, description: 'Write and save notes' },
  { id: 'snake', label: 'Snake', icon: crystalIcons.snake, description: 'Play a quick game' },
  { id: 'gallery', label: 'Gallery', icon: crystalIcons.gallery, description: 'Open the picture library' },
  { id: 'music', label: 'Music', icon: crystalIcons.music, description: 'Browse and play music' },
] as const;
export type DesktopUtilityId = (typeof desktopUtilities)[number]['id'];

export const desktopLinks = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/monabji', description: 'See my code' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://in.linkedin.com/in/manav-soni-310784375', description: 'Connect with me' },
  { id: 'email', label: 'Email', href: 'mailto:manav.bhavinsoni2025@vitstudent.ac.in', description: 'Write me an email' },
] as const;

export const aboutTabs = ['Overview', 'Education', 'Skills', 'Experience', 'Connect'] as const;
export type AboutTab = (typeof aboutTabs)[number];

export const education = [
  { years: '2025 - 2029', qualification: 'B.Tech, Computer Science & Engineering (Core)', institution: 'VIT University, Vellore Campus' },
  { years: '12th grade', qualification: 'Senior Secondary Education', institution: 'Allen Career Institute, Bangalore' },
  { years: '10th grade', qualification: 'Secondary Education', institution: 'Freedom International School, Bangalore' },
] as const;

export const skills = [
  { label: 'Languages', detail: 'C, C++, Python, Lua, GDScript, HTML, CSS', level: '88%' },
  { label: 'Development', detail: 'Bots, websites, and AI-based projects using Python', level: '76%' },
  { label: 'Practice', detail: 'HackerRank, Codeforces, CTFs', level: '67%' },
] as const;

export const experience = [
  { role: 'Core Member', organization: 'Association for Computing Machinery (ACM)', logo: '/experience/acm.png', alt: 'Association for Computing Machinery logo' },
  { role: 'Vice President - PR', organization: 'Nuvens Toastmasters International', logo: '/experience/toastmasters.png', alt: 'Toastmasters International logo' },
] as const;

export const socialLinks = [
  { label: 'GitHub', detail: '@monabji', href: 'https://github.com/monabji', glyph: 'GH' },
  { label: 'LinkedIn', detail: 'Manav Soni', href: 'https://in.linkedin.com/in/manav-soni-310784375', glyph: 'in' },
  { label: 'Email', detail: 'manav.bhavinsoni2025@vitstudent.ac.in', href: 'mailto:manav.bhavinsoni2025@vitstudent.ac.in', icon: crystalIcons.browser },
] as const;

export type Project = {
  title: string;
  status: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
  icon: string;
  image?: string;
  alt?: string;
  category?: string;
};

export const softwareProjects: Project[] = [
  { title: 'CarWars', status: 'Shipped', description: 'A PSX-style car game built from the ground up with Unity and original Blender assets, showcased at the Gravitas Expo.', tags: ['Unity', 'Blender', 'Game development'], icon: crystalIcons.gamepad, links: [{ label: 'Open source code', href: 'https://github.com/ACM-VIT/carwars' }] },
  { title: 'AI Retinopathy Grading', status: 'In progress', description: 'An AI project in progress for detecting and grading diabetic retinopathy from retinal imagery using the IDRiD dataset.', tags: ['Python', 'AI / ML', 'Healthtech'], icon: crystalIcons.code, links: [{ label: 'Open source code', href: 'https://github.com/monabji/idrid-dr-grading' }] },
  { title: 'Hackathon Winners Library', status: 'Live website', description: 'A focused website for tracking hackathon winners and collecting standout builds in one browsable library.', tags: ['Web', 'Database', 'Hackathons'], icon: crystalIcons.browser, links: [{ label: 'Visit website', href: 'https://hackathon-winners-library.vercel.app/' }, { label: 'Open source code', href: 'https://github.com/monabji/hackathon-winners-library' }] },
  { title: 'UDID Saathi', status: 'Prototype', description: 'An accessible citizen-service redesign for India’s UDID journey: applications, corrections, appointments, renewals, and progress tracking for the Build For India hackathon.', tags: ['React', 'TypeScript', 'Accessibility'], icon: crystalIcons.browser, links: [{ label: 'Visit website', href: 'https://build-for-india-main.vercel.app/' }, { label: 'Open source code', href: 'https://github.com/monabji/build-for-india' }] },
  { title: 'Tonoclear', status: '3rd place', description: 'A hardware and IoT build created for the ACEi Hackathon in Chennai. The project took third place.', tags: ['Hardware', 'IoT', 'Hackathon'], icon: crystalIcons.projects, links: [{ label: 'View presentation', href: 'https://docs.google.com/presentation/d/1qWeE5ZlsOR0pKk2-CBKRMkFW9mXUaIu1w1aE0Wzf25I/edit?usp=sharing' }] },
];

export const designProjects: Project[] = [
  { title: 'Skull Landscape', status: 'Blender', category: 'Landscapes / Blender', image: '/work/skull-landscape.png', alt: 'A Blender render of a skull in a rocky landscape with shallow depth of field', description: 'Natural textures, depth of field, and a cinematic environmental composition.', tags: ['3D', 'Environment'], icon: crystalIcons.blender, links: [] },
  { title: 'Liminal Pool', status: 'Blender', category: 'Landscapes / Blender', image: '/work/liminal-pool.png', alt: 'A liminal indoor swimming pool rendered in Blender', description: 'An atmospheric interior study built around reflections and spatial lighting.', tags: ['3D', 'Lighting'], icon: crystalIcons.blender, links: [] },
  { title: 'Flooded Tunnel', status: 'Blender', category: 'Landscapes / Blender', image: '/work/flooded-tunnel.png', alt: 'A moody flooded tunnel environment rendered in Blender', description: 'Repetition, water, and subdued lighting create an immersive architectural scene.', tags: ['3D', 'Environment'], icon: crystalIcons.blender, links: [] },
  { title: 'Fog City', status: 'Game map', category: 'Game map design', image: '/work/game-map.png', alt: 'A foggy, abandoned-looking city block designed as a game map', description: 'A quiet urban block with worn buildings, dim streetlights, and an uneasy mood.', tags: ['Game map', 'Worldbuilding'], icon: crystalIcons.blender, links: [] },
  { title: 'Procedural Planet', status: 'Blender', category: 'Nodes / Blender', image: '/work/procedural-planet.png', alt: 'A blue procedural planet with cloud detail against a black background', description: 'Layered noise and shader nodes create scalable terrain, clouds, and atmosphere.', tags: ['Shaders', 'Nodes'], icon: crystalIcons.blender, links: [] },
  { title: 'Board Game Assets', status: 'Blender', category: 'Assets / Blender', image: '/work/dice-assets.png', alt: 'A colorful Blender render of a die surrounded by board game pawns', description: 'A playful modeling and materials study using simple, readable forms.', tags: ['Assets', 'Materials'], icon: crystalIcons.blender, links: [] },
];
