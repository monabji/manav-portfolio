/**
 * Serve pixel-identical, lossless WebP copies of bundled portfolio images.
 * Original URLs remain valid for saved site configuration and existing links.
 */
export function getOptimizedImageSrc(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const path = base && src.startsWith(`${base}/`) ? src.slice(base.length) : src;
  switch (path) {
    case '/work/dice-assets.png':
      return publicPath('/work/dice-assets.webp');
    case '/work/flooded-tunnel.png':
      return publicPath('/work/flooded-tunnel.webp');
    case '/work/game-map.png':
      return publicPath('/work/game-map.webp');
    case '/work/hot-chocolate.png':
      return publicPath('/work/hot-chocolate.webp');
    case '/work/liminal-pool.png':
      return publicPath('/work/liminal-pool.webp');
    case '/work/procedural-planet.png':
      return publicPath('/work/procedural-planet.webp');
    case '/work/skull-landscape.png':
      return publicPath('/work/skull-landscape.webp');
    case '/experience/acm.png':
      return publicPath('/experience/acm.webp');
    case '/experience/toastmasters.png':
      return publicPath('/experience/toastmasters.webp');
    default:
      return publicPath(path);
  }
}
import { publicPath } from '@/lib/public-path';
