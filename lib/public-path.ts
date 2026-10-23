const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function publicPath(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || !basePath) return path;
  return path.startsWith(`${basePath}/`) || path === basePath
    ? path
    : `${basePath}${path}`;
}
