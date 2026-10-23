/**
 * Serve pixel-identical, lossless WebP copies of bundled portfolio images.
 * Original URLs remain valid for saved site configuration and existing links.
 */
export function getOptimizedImageSrc(src: string): string {
  switch (src) {
    case '/work/dice-assets.png':
      return '/work/dice-assets.webp';
    case '/work/flooded-tunnel.png':
      return '/work/flooded-tunnel.webp';
    case '/work/game-map.png':
      return '/work/game-map.webp';
    case '/work/hot-chocolate.png':
      return '/work/hot-chocolate.webp';
    case '/work/liminal-pool.png':
      return '/work/liminal-pool.webp';
    case '/work/procedural-planet.png':
      return '/work/procedural-planet.webp';
    case '/work/skull-landscape.png':
      return '/work/skull-landscape.webp';
    case '/experience/acm.png':
      return '/experience/acm.webp';
    case '/experience/toastmasters.png':
      return '/experience/toastmasters.webp';
    default:
      return src;
  }
}
