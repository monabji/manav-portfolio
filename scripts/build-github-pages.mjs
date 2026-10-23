import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// Vinext beta.5's exporter requests unprefixed URLs from a server mounted at
// basePath. Apply this build-only workaround, then restore the package.
const prerenderFile = 'node_modules/vinext/dist/build/prerender.js';
const original = await readFile(prerenderFile, 'utf8');
const request = 'new Request(`http://localhost${urlPath}`';
if (!original.includes(request)) throw new Error('Review the Vinext basePath workaround: exporter implementation changed.');
const patched = original.replaceAll(request, 'new Request(`http://localhost${config.basePath ?? ""}${urlPath}`');
let status;
try {
  await writeFile(prerenderFile, patched);
  const result = spawnSync(process.execPath, ['node_modules/vinext/dist/cli.js', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' },
  });
  if (result.error) throw result.error;
  status = result.status ?? 1;
} finally {
  await writeFile(prerenderFile, original);
}
if (status !== 0) process.exit(status);
await import('./prepare-github-pages.mjs');
