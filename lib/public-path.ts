const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function appPath(path: string): string {
  if (basePath && path === basePath) return '/';
  return basePath && path.startsWith(`${basePath}/`)
    ? path.slice(basePath.length)
    : path;
}

export function publicPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || !basePath) return path;
  return path.startsWith(`${basePath}/`) || path === basePath
    ? path
    : `${basePath}${path}`;
}
