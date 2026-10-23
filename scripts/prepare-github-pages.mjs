import { rename, access, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Pages mounts the artifact at /manav-portfolio; remove Vinext's extra
// filesystem layer without rewriting any JavaScript or route identities.
const nestedAssets = 'dist/client/manav-portfolio/_next';
try {
  await access(nestedAssets);
  await rename(nestedAssets, 'dist/client/_next');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Only CSS image URLs need a public asset prefix. Never rewrite JS, JSON,
// HTML payloads, or framework route identifiers.
async function prefixCssImages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await prefixCssImages(path);
    else if (entry.name.endsWith('.css')) {
      const source = await readFile(path, 'utf8');
      const fixed = source
        .replace(/url\((["']?)\/(?!\/|manav-portfolio\/)/g, 'url($1/manav-portfolio/')
        .replace(/url\((["']?)\/manav-portfolio\/_next\/static\/(crystal|win7|aero|brands)\//g, 'url($1/manav-portfolio/$2/');
      await writeFile(path, fixed);
    }
  }
}
await prefixCssImages('dist/client');
