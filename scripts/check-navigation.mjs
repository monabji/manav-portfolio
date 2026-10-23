// Run after npm run build and starting the production preview (not the dev server):
// NAVIGATION_TEST_ORIGIN=http://localhost:4173 node scripts/check-navigation.mjs
// Install Playwright locally, or set PLAYWRIGHT_MODULE to its index.mjs file URL.
// CHROME_EXECUTABLE optionally selects an existing browser executable.
import assert from 'node:assert/strict';

const origin = process.env.NAVIGATION_TEST_ORIGIN || 'http://localhost:4173';
assert.ok(
  ['localhost', '127.0.0.1'].includes(new URL(origin).hostname),
  'Run against a local preview.',
);
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const executablePath = process.env.CHROME_EXECUTABLE || process.env.CHROME_PATH;
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && message.text().includes('[vinext]'))
      errors.push(message.text());
  });

  await page.goto(`${origin}/about`);
  await page.locator('.taskbar-apps a[href="/projects"]').waitFor();
  await page.evaluate(() => {
    window.__navigationCheck = 'same-document';
  });
  await page.locator('.taskbar-apps a[href="/projects"]').click();
  await page.waitForURL(`${origin}/projects`);
  await page.locator('.projects-window').waitFor();
  assert.equal(
    await page.evaluate(() => window.__navigationCheck),
    'same-document',
    'Link navigation reloaded the document.',
  );

  await page.goBack();
  await page.waitForURL(`${origin}/about`);
  assert.equal(
    await page.evaluate(() => window.__navigationCheck),
    'same-document',
    'Back navigation reloaded the document.',
  );
  assert.deepEqual(
    errors,
    [],
    `Navigation/prefetch errors: ${errors.join('; ')}`,
  );
  console.log(
    'PASS: production Link navigation, retained document, history back, and no runtime/prefetch errors.',
  );
} finally {
  await browser.close();
}
