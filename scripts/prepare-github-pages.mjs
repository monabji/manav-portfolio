import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist/client';
const basePath = '/manav-portfolio';
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '.webmanifest']);

async function processDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(path);
      continue;
    }
    const extension = path.slice(path.lastIndexOf('.'));
    if (!textExtensions.has(extension)) continue;
    const source = await readFile(path, 'utf8');
    const prefixed = source
      .replace(/(["'`])\/(?!\/|manav-portfolio\/)(?=[A-Za-z0-9_.~-])/g, `$1${basePath}/`)
      .replace(/(["'`])\/(\1)/g, `$1${basePath}/$2`)
      // Keep Vinext's route identity unprefixed so the hydration payload matches
      // its route manifest. The repository prefix belongs on network URLs only.
      .replace(/("pathname":")\/manav-portfolio(?=\/|")/g, '$1');
    if (prefixed !== source) await writeFile(path, prefixed);
  }
}

await processDirectory(root);
