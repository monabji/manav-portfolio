import { publicPath } from '@/lib/public-path';

export const windows7Icons = {
  home: publicPath('/win7/theme/filesystems/gnome-fs-home.png'),
  profile: publicPath('/win7/theme/apps/user-icon.png'),
  projects: publicPath('/win7/theme/filesystems/folder-software.png'),
  browser: publicPath('/win7/theme/apps/web-browser.png'),
  code: publicPath('/win7/theme/categories/applications-development.png'),
  blender: publicPath('/win7/theme/apps/blender.png'),
  notepad: publicPath('/win7/theme/apps/wine-notepad.png'),
  gamepad: publicPath('/win7/theme/categories/applications-games.png'),
  snake: publicPath('/win7/theme/categories/applications-games.png'),
  gallery: publicPath('/win7/theme/apps/eog.png'),
  email: publicPath('/win7/theme/apps/internet-mail.png'),
  music: publicPath('/win7/theme/apps/banshee.png'),
  dashboard: publicPath('/win7/theme/apps/control-center.png'),
  sound: publicPath('/win7/theme/apps/multimedia-volume-control.png'),
} as const;

// Kept while the Pictures Library and project explorer migrate to the theme registry.
export const crystalIcons = windows7Icons;

export const desktopApps = [
  {
    href: '/',
    label: 'Home',
    icon: windows7Icons.home,
    description: 'Welcome screen',
  },
  {
    href: '/about',
    label: 'About me',
    icon: windows7Icons.profile,
    description: 'Education, skills and experience',
  },
  {
    href: '/projects',
    label: 'My projects',
    icon: windows7Icons.projects,
    description: 'Code, games and 3D work',
  },
  {
    href: '/dashboard',
    label: 'My dashboard',
    startMenuOnly: true,
    icon: windows7Icons.dashboard,
    description: 'Personal desktop settings',
  },
] as const;

// Route shortcuts outside Start use this list, so owner tools stay out of sight.
export const workspaceApps = desktopApps.filter(
  (app) => !('startMenuOnly' in app && app.startMenuOnly),
);

export const desktopUtilities = [
  {
    id: 'notepad',
    label: 'Notepad',
    icon: windows7Icons.notepad,
    description: 'Write and save notes',
  },
  {
    id: 'snake',
    label: 'Snake',
    icon: windows7Icons.snake,
    description: 'Play a quick game',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: windows7Icons.gallery,
    description: 'Open the picture library',
  },
  {
    id: 'music',
    label: 'Music',
    icon: windows7Icons.music,
    description: 'Listen to my Spotify playlist',
  },
  {
    id: 'doom',
    label: 'DOOM',
    icon: windows7Icons.gamepad,
    description: 'Play DOOM online inside Manav OS',
  },
  {
    id: 'sticky-notes',
    label: 'Sticky Notes',
    icon: windows7Icons.notepad,
    description: 'Create and keep desktop notes',
  },
] as const;
export type DesktopUtilityId = (typeof desktopUtilities)[number]['id'];

export const spotifyMusic = {
  embedUrl:
    'https://open.spotify.com/embed/playlist/0jhgk8M8ITveMfCZJYpXbZ?utm_source=generator&si=aa44161879384bae',
  playlistUrl: 'https://open.spotify.com/playlist/0jhgk8M8ITveMfCZJYpXbZ',
  profileUrl: 'https://open.spotify.com/user/bbmdqdt5b0oncnzpy8tmpgxax',
} as const;

// Hosted players, not locally recreated games. Keep embed URLs and providers here.
export const onlineGames = {
  doom: {
    title: 'DOOM',
    provider: 'TheDoggyBrad / JS-DOS',
    sourceUrl: 'https://thedoggybrad.github.io/doom_on_js-dos/',
    embedUrl: 'https://thedoggybrad.github.io/doom_on_js-dos/',
  },
} as const;

export const desktopLinks = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/monabji',
    description: 'See my code',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://in.linkedin.com/in/manav-soni-310784375',
    description: 'Connect with me',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:manav.bhavinsoni2025@vitstudent.ac.in',
    description: 'Write me an email',
  },
] as const;

export const aboutTabs = [
  'Overview',
  'Education',
  'Skills',
  'Experience',
  'Connect',
] as const;
export type AboutTab = (typeof aboutTabs)[number];

export const education = [
  {
    years: '2025 - 2029 (Expected)',
    qualification: 'B.Tech, Computer Science & Engineering (Core)',
    institution: 'Vellore Institute of Technology (VIT), Vellore',
    detail:
      'Relevant coursework: Database Management Systems, Object-Oriented Programming, Computer Networks, Computer Architecture, Probability and Statistics, Embedded Systems.',
  },
  {
    years: '12th grade',
    qualification: 'Senior Secondary Education',
    institution: 'Allen Career Institute, Bangalore',
  },
  {
    years: '10th grade',
    qualification: 'Secondary Education',
    institution: 'Freedom International School, Bangalore',
  },
] as const;

export const skills = [
  {
    label: 'Programming',
    detail:
      'Python, C, C++, Java, C#, SQL, JavaScript, TypeScript, Lua, GDScript, HTML, CSS',
  },
  {
    label: 'Databases',
    detail:
      'MySQL, relational modeling, ER/EER design, normalization (1NF to 3NF), recursive and many-to-many relationships',
  },
  {
    label: 'Machine learning',
    detail:
      'Regression, supervised learning, feature engineering, data preprocessing, train/validation/test workflows, model evaluation',
  },
  {
    label: 'Tools and frameworks',
    detail:
      'Unity, Blender, Git, GitHub, Next.js, Tailwind CSS, shadcn/ui, VS Code, Linux, Windows',
  },
  { label: 'Practice', detail: 'HackerRank, Codeforces, CTFs' },
] as const;

export const achievements = [
  {
    title: 'ACEi Hackathon, third place',
    detail:
      'TonoClear, an ophthalmology training simulator demonstrated in Chennai',
  },
  {
    title: 'Code Cortex Hackathon winner',
    detail: 'MANU, a protein mutation stability prediction system',
  },
  {
    title: 'Code2Create Hackathon finalist',
    detail: 'Selected for final-stage evaluation',
  },
  {
    title: 'NutriHack Food Hackathon finalist',
    detail: 'sork, a nutrient degradation tracker',
  },
] as const;

export const experience = [
  {
    role: 'Technical Core Member',
    organization: 'ACM-VIT, Association for Computing Machinery',
    logo: publicPath('/experience/acm.png'),
    alt: 'Association for Computing Machinery logo',
  },
  {
    role: 'Vice President - PR',
    organization: 'Nuvens Toastmasters International',
    logo: publicPath('/experience/toastmasters.png'),
    alt: 'Toastmasters International logo',
  },
] as const;

export const socialLinks = [
  {
    label: 'GitHub',
    detail: '@monabji',
    href: 'https://github.com/monabji',
    icon: publicPath('/brands/github.svg'),
  },
  {
    label: 'LinkedIn',
    detail: 'Manav Soni',
    href: 'https://in.linkedin.com/in/manav-soni-310784375',
    icon: publicPath('/brands/linkedin.svg'),
  },
  {
    label: 'Email',
    detail: 'manav.bhavinsoni2025@vitstudent.ac.in',
    href: 'mailto:manav.bhavinsoni2025@vitstudent.ac.in',
    icon: windows7Icons.email,
  },
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
  {
    title: 'MANU',
    status: 'Code Cortex winner',
    description:
      'A supervised regression system that predicts protein stability changes caused by single amino acid mutations. Built an end-to-end workflow covering dataset preprocessing, mutation-level feature preparation, model training, validation and metric-based evaluation. Presented the research use case, methodology and limitations to judges, winning the Code Cortex Hackathon.',
    tags: ['Python', 'Machine learning', 'Regression', 'Biotechnology'],
    icon: windows7Icons.code,
    links: [
      { label: 'Open source code', href: 'https://github.com/monabji/Manu' },
    ],
  },
  {
    title: 'CarWars',
    status: 'Shipped',
    description:
      'A PS1-style player-versus-player vehicle combat game built in Unity with C#. Developed responsive car controls, collision handling, damage and game-state logic, and an arcade combat loop. Created low-poly assets and retro materials in Blender, then refined physics, asset scaling, UI and handling through playtesting. Showcased at the Gravitas Expo.',
    tags: ['Unity', 'C#', 'Blender', 'Game development'],
    icon: windows7Icons.gamepad,
    links: [
      { label: 'Open source code', href: 'https://github.com/ACM-VIT/carwars' },
    ],
  },
  {
    title: 'Research Paper Knowledge Graph',
    status: 'In progress',
    description:
      'A MySQL database project in progress connecting research papers, authors, institutions, datasets, methods, citations and keywords. The design models many-to-many authorship relationships and recursive citation networks, translates ER/EER designs into relational schemas, and normalizes tables through 3NF for reliable queries and reduced redundancy.',
    tags: ['MySQL', 'Database design', 'ER/EER modeling', 'Normalization'],
    icon: windows7Icons.projects,
    links: [],
  },
  {
    title: 'sork (NutriHack)',
    status: 'NutriHack finalist',
    description:
      'A nutrient degradation tracker built for the NutriHack Food Hackathon. The project explores food-supply-chain scenarios using product facts, transport assumptions and clearly labeled nutrient-decay and emissions estimates. Built with React, TypeScript and Vite.',
    tags: ['React', 'TypeScript', 'Vite', 'NutriHack'],
    icon: windows7Icons.projects,
    links: [
      { label: 'Open source code', href: 'https://github.com/monabji/Sork' },
    ],
  },
  {
    title: 'AI Retinopathy Grading',
    status: 'In progress',
    description:
      'An AI project in progress for detecting and grading diabetic retinopathy from retinal imagery using the IDRiD dataset.',
    tags: ['Python', 'AI / ML', 'Healthtech'],
    icon: windows7Icons.code,
    links: [
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/idrid-dr-grading',
      },
    ],
  },
  {
    title: 'Hackathon Winners Library',
    status: 'Live website',
    description:
      'A focused website for tracking hackathon winners and collecting standout builds in one browsable library.',
    tags: ['Web', 'Database', 'Hackathons'],
    icon: windows7Icons.browser,
    links: [
      {
        label: 'Visit website',
        href: 'https://hackathon-winners-library.vercel.app/',
      },
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/hackathon-winners-library',
      },
    ],
  },
  {
    title: 'UDID Saathi',
    status: 'Prototype',
    description:
      'An accessible citizen-service redesign for India’s UDID journey: applications, corrections, appointments, renewals, and progress tracking for the Build For India hackathon.',
    tags: ['React', 'TypeScript', 'Accessibility'],
    icon: windows7Icons.browser,
    links: [
      {
        label: 'Visit website',
        href: 'https://build-for-india-main.vercel.app/',
      },
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/build-for-india',
      },
    ],
  },
  {
    title: 'TonoClear',
    status: '3rd place',
    description:
      'A functional ophthalmology training prototype for applanation tonometry and ocular foreign-body removal, built in response to an Aravind Eye Hospital challenge. Integrated a physical model eye, sensing hardware and software feedback to support instrument positioning, force control and repeatable practice. Demonstrated at the ACEi Hackathon in Chennai.',
    tags: ['Healthcare simulation', 'Hardware', 'IoT', 'Software integration'],
    icon: windows7Icons.code,
    links: [
      {
        label: 'View presentation',
        href: 'https://docs.google.com/presentation/d/1qWeE5ZlsOR0pKk2-CBKRMkFW9mXUaIu1w1aE0Wzf25I/edit?usp=sharing',
      },
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/Applanation-tonometry-webapp',
      },
    ],
  },
  {
    title: 'cookie-curtain',
    status: 'Public repository',
    description:
      'A privacy-first Chromium extension that automatically rejects cookie consent pop-ups.',
    tags: ['JavaScript', 'Chromium', 'Browser extension', 'Privacy'],
    icon: windows7Icons.browser,
    links: [
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/cookie-curtain',
      },
    ],
  },
  {
    title: 'spica',
    status: 'Public repository',
    description:
      'A game-like user interface for the pi harness, written in Zig. This repository is a fork of ACM-VIT/spica.',
    tags: ['Zig', 'UI', 'Game development'],
    icon: windows7Icons.gamepad,
    links: [
      { label: 'Open source code', href: 'https://github.com/monabji/spica' },
    ],
  },
  {
    title: 'manav-portfolio',
    status: 'In progress',
    description:
      'A personal portfolio website that is still being developed and has not yet been hosted.',
    tags: ['TypeScript', 'Portfolio', 'Web'],
    icon: windows7Icons.home,
    links: [
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/manav-portfolio',
      },
    ],
  },
  {
    title: 'Pocket-town',
    status: 'Hackathon project',
    description:
      'A financial learning game for kids, made for the IIIT Hyderabad Megathon x Singularity Hackathon.',
    tags: ['Game development', 'Financial literacy', 'Hackathon'],
    icon: windows7Icons.profile,
    links: [
      {
        label: 'Open source code',
        href: 'https://github.com/monabji/Pocket-town',
      },
    ],
  },
];

export const designProjects: Project[] = [
  {
    title: 'Skull Landscape',
    status: 'Blender',
    category: 'Landscapes / Blender',
    image: publicPath('/work/skull-landscape.png'),
    alt: 'A Blender render of a skull in a rocky landscape with shallow depth of field',
    description:
      'Natural textures, depth of field, and a cinematic environmental composition.',
    tags: ['3D', 'Environment'],
    icon: windows7Icons.blender,
    links: [],
  },
  {
    title: 'Liminal Pool',
    status: 'Blender',
    category: 'Landscapes / Blender',
    image: publicPath('/work/liminal-pool.png'),
    alt: 'A liminal indoor swimming pool rendered in Blender',
    description:
      'An atmospheric interior study built around reflections and spatial lighting.',
    tags: ['3D', 'Lighting'],
    icon: windows7Icons.blender,
    links: [],
  },
  {
    title: 'Flooded Tunnel',
    status: 'Blender',
    category: 'Landscapes / Blender',
    image: publicPath('/work/flooded-tunnel.png'),
    alt: 'A moody flooded tunnel environment rendered in Blender',
    description:
      'Repetition, water, and subdued lighting create an immersive architectural scene.',
    tags: ['3D', 'Environment'],
    icon: windows7Icons.blender,
    links: [],
  },
  {
    title: 'Fog City',
    status: 'Game map',
    category: 'Game map design',
    image: publicPath('/work/game-map.png'),
    alt: 'A foggy, abandoned-looking city block designed as a game map',
    description:
      'A quiet urban block with worn buildings, dim streetlights, and an uneasy mood.',
    tags: ['Game map', 'Worldbuilding'],
    icon: windows7Icons.blender,
    links: [],
  },
  {
    title: 'Procedural Planet',
    status: 'Blender',
    category: 'Nodes / Blender',
    image: publicPath('/work/procedural-planet.png'),
    alt: 'A blue procedural planet with cloud detail against a black background',
    description:
      'Layered noise and shader nodes create scalable terrain, clouds, and atmosphere.',
    tags: ['Shaders', 'Nodes'],
    icon: windows7Icons.blender,
    links: [],
  },
  {
    title: 'Board Game Assets',
    status: 'Blender',
    category: 'Assets / Blender',
    image: publicPath('/work/dice-assets.png'),
    alt: 'A colorful Blender render of a die surrounded by board game pawns',
    description:
      'A playful modeling and materials study using simple, readable forms.',
    tags: ['Assets', 'Materials'],
    icon: windows7Icons.blender,
    links: [],
  },
];
