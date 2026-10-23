import type { NextConfig } from 'next';

const githubPages = process.env.GITHUB_PAGES === 'true';
const basePath = githubPages ? '/manav-portfolio' : '';

const nextConfig: NextConfig = {
  ...(githubPages ? { output: 'export' as const } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
