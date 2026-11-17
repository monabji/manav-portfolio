import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const origin =
  process.env.PAGES_TEST_URL || 'http://127.0.0.1:4173/manav-portfolio/';
assert.ok(
  ['localhost', '127.0.0.1'].includes(new URL(origin).hostname),
  'Use a local build.',
);
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE
    ? { executablePath: process.env.CHROME_EXECUTABLE }
    : {}),
});

async function context(options = {}) {
  const result = await browser.newContext(options);
  await result.route('**/*', (route) =>
    new URL(route.request().url()).origin === new URL(origin).origin
      ? route.continue()
      : route.abort(),
  );
  return result;
}

try {
  const normal = await context();
  const page = await normal.newPage();
  const errors = [];
  const badResponses = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) badResponses.push(response.url());
  });
  await page.goto(origin);
  await page.getByRole('heading', { name: 'Manav', exact: true }).waitFor();
  assert.equal(await page.title(), "Manav's portfolio");
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
  assert.equal(
    new URL(favicon, origin).href,
    new URL('favicon.png', origin).href,
  );
  assert.equal(
    (await page.request.get(new URL(favicon, origin).href)).status(),
    200,
  );
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  const imageResponse = await page.request.get(
    image.replace('https://monabji.github.io', new URL(origin).origin),
  );
  assert.deepEqual(
    await imageResponse.body(),
    await readFile(
      new URL('../public/wallpapers/bliss-xp.png', import.meta.url),
    ),
  );

  for (const route of ['about', 'projects']) {
    await page.locator(`.taskbar-apps a[href$="/${route}"]`).click();
    await page.waitForURL(new URL(route, origin).href);
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute('href'),
      `https://monabji.github.io/manav-portfolio/${route}`,
    );
    assert.equal(
      await page.locator('meta[property="og:url"]').getAttribute('content'),
      `https://monabji.github.io/manav-portfolio/${route}`,
    );
  }
  await page
    .locator('.content-window .explorer-history')
    .getByRole('button', { name: 'Back', exact: true })
    .click();
  await page.waitForURL(new URL('about', origin).href);
  await page
    .locator('.content-window .explorer-history')
    .getByRole('button', { name: 'Forward', exact: true })
    .click();
  await page.waitForURL(new URL('projects', origin).href);
  await page
    .locator('.content-window .explorer-commandbar')
    .getByRole('button', { name: 'Open', exact: true })
    .click();
  await page
    .getByRole('menuitem', { name: 'Sticky Notes', exact: true })
    .click();
  await page.locator('.sticky-note textarea').waitFor();
  await page.locator('.sticky-note textarea').fill('Persistent note');
  await page.reload();
  await page.locator('.sticky-note textarea').waitFor();
  assert.equal(
    await page.locator('.sticky-note textarea').inputValue(),
    'Persistent note',
  );
  await page
    .locator('.desktop-icons button[title="Write and save notes"]')
    .click();
  await page.getByRole('textbox', { name: 'Notepad text' }).fill('Saved note');
  await page.reload();
  await page
    .locator('.desktop-icons button[title="Write and save notes"]')
    .click();
  await page.getByText('Saved on this device', { exact: true }).waitFor();
  assert.equal(
    await page.getByRole('textbox', { name: 'Notepad text' }).inputValue(),
    'Saved note',
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(badResponses, []);
  await normal.close();
  console.log(
    'PASS: title, favicon, Bliss preview, route metadata, Explorer history, Sticky Notes persistence',
  );

  for (const failure of ['blocked', 'quota']) {
    const isolated = await context({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    await isolated.addInitScript((mode) => {
      if (mode === 'blocked') {
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new DOMException('Storage blocked', 'SecurityError');
          },
        });
      } else {
        const original = Reflect.get(Storage.prototype, 'setItem');
        Storage.prototype.setItem = function (key, value) {
          if (key === 'manav-notepad')
            throw new DOMException('Quota exceeded', 'QuotaExceededError');
          return Reflect.apply(original, this, [key, value]);
        };
      }
    }, failure);
    const local = await isolated.newPage();
    await local.goto(origin);
    await local.getByRole('heading', { name: 'Manav', exact: true }).waitFor();
    await local
      .locator('.desktop-icons button[title="Write and save notes"]')
      .click();
    const editor = local.getByRole('textbox', { name: 'Notepad text' });
    await editor.fill('Keep this unsaved draft');
    await local
      .getByText('Not saved — use Save as .txt', { exact: true })
      .waitFor();
    assert.equal(await editor.inputValue(), 'Keep this unsaved draft');
    const download = local.waitForEvent('download');
    await local
      .getByRole('button', { name: 'Save as .txt', exact: true })
      .click();
    assert.equal((await download).suggestedFilename(), 'manav-notepad.txt');
    assert.equal(
      await local.getByRole('heading', { name: 'Manav', exact: true }).count(),
      1,
    );
    await isolated.close();
    console.log(
      `PASS: ${failure} storage keeps desktop, draft and text export usable on mobile`,
    );
  }
} finally {
  await browser.close();
}
