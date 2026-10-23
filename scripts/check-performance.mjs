import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const origin = process.env.PERFORMANCE_TEST_ORIGIN || 'http://localhost:4173';
assert.ok(
  ['localhost', '127.0.0.1'].includes(new URL(origin).hostname),
  'Run against a local preview.',
);
const out = process.env.PERFORMANCE_TEST_OUTPUT || 'outputs/performance';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE
    ? { executablePath: process.env.CHROME_EXECUTABLE }
    : {}),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 900 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  const failed = [];
  let configReads = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (new URL(response.url()).origin === origin) {
      if (response.url().endsWith('/api/site-config')) configReads++;
      if (response.status() >= 400 && !response.url().endsWith('/favicon.ico'))
        failed.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto(`${origin}/about`);
  await page.getByRole('tab', { name: 'Skills', exact: true }).waitFor();
  await page.waitForFunction(
    () => document.querySelector('.tray time')?.textContent.length > 0,
  );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/after-about.png` });
  await page.evaluate(() => {
    window.__desktopProbe = document.querySelector('.taskbar');
  });
  await page.locator('.taskbar-apps button[aria-label="Open Notepad"]').click();
  await page
    .getByRole('textbox', { name: 'Notepad text' })
    .fill('Performance regression check');
  const dragWindow = page.locator('.utility-notepad');
  const header = dragWindow.locator('.window-titlebar');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(250);
  const before = await dragWindow.boundingBox();
  const bar = await header.boundingBox();
  await page.mouse.move(bar.x + 90, bar.y + 12);
  await page.mouse.down();
  await page.mouse.move(bar.x + 130, bar.y + 42, { steps: 30 });
  await page.mouse.up();
  const after = await dragWindow.boundingBox();
  assert.ok(Math.abs(after.x - before.x - 40) < 2);
  assert.ok(Math.abs(after.y - before.y - 30) < 2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const start = Date.now();
  await page.locator('.taskbar-apps a[href="/projects"]').click();
  await page.getByRole('heading', { name: 'Things I’ve built' }).waitFor();
  const navigationMs = Date.now() - start;
  assert.equal(
    await page.evaluate(
      () => window.__desktopProbe === document.querySelector('.taskbar'),
    ),
    true,
    'Navigation replaced the desktop document.',
  );
  assert.equal(
    await page.getByRole('textbox', { name: 'Notepad text' }).inputValue(),
    'Performance regression check',
  );
  assert.equal(configReads, 1, 'Route navigation fetched all settings again.');
  await dragWindow
    .getByRole('button', { name: 'Minimize Notepad', exact: true })
    .click();
  await page.screenshot({ path: `${out}/after-projects.png` });
  await page.getByRole('button', { name: '3D showcase', exact: true }).click();
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('.gallery-grid img')).every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
  assert.ok((await page.locator('.gallery-grid img').count()) > 0);
  assert.equal(
    await page.locator('.gallery-grid img[src$=".webp"]').count(),
    await page.locator('.gallery-grid img').count(),
  );
  await page.screenshot({ path: `${out}/after-gallery.png` });
  const title = await page
    .locator('.gallery-grid button strong')
    .first()
    .innerText();
  await page.locator('.gallery-grid button').first().click();
  await page.getByRole('dialog', { name: title, exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page
    .getByRole('dialog', { name: title, exact: true })
    .waitFor({ state: 'hidden' });
  await page.locator('.taskbar-apps a[href="/about"]').click();
  await page.getByRole('tab', { name: 'Skills', exact: true }).waitFor();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const tabTimings = [];
  for (const name of [
    'Skills',
    'Education',
    'Experience',
    'Connect',
    'Overview',
  ]) {
    const duration = await page.evaluate(async (name) => {
      const tab = Array.from(document.querySelectorAll('[role="tab"]')).find(
        (el) => el.textContent === name,
      );
      const start = performance.now();
      tab.click();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      if (tab.getAttribute('aria-selected') !== 'true')
        throw Error(`Tab ${name} did not activate`);
      return performance.now() - start;
    }, name);
    tabTimings.push({ name, ms: Math.round(duration) });
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.getByRole('tab', { name: 'Overview', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await page
      .getByRole('tab', { name: 'Education', exact: true })
      .getAttribute('aria-selected'),
    'true',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/about`);
  await page.getByRole('tab', { name: 'Skills', exact: true }).waitFor();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/after-mobile.png` });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.getByRole('tab', { name: 'Skills', exact: true }).click();
  assert.equal(
    await page
      .getByRole('tab', { name: 'Skills', exact: true })
      .getAttribute('aria-selected'),
    'true',
  );
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(`${origin}/`);
  await page.locator('.people-hero canvas').waitFor();
  await page
    .getByRole('button', { name: 'Minimize Welcome to Manav OS', exact: true })
    .click();
  await page.locator('.people-hero canvas').waitFor({ state: 'hidden' });
  await page.locator('.taskbar-apps a[href="/"]').click();
  await page.locator('.people-hero canvas').waitFor();
  assert.equal(await page.locator('.people-hero canvas').count(), 1);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const report = {
    navigationMs,
    documentPreserved: true,
    configReadsDuringNavigation: 1,
    cpuThrottle: 6,
    tabTimings,
    checks: [
      'drag coordinates',
      'notepad preserved across routes',
      'minimize and restore',
      'gallery lossless assets',
      'project deep link and Escape',
      'keyboard tabs',
      '390px viewport',
      'home WebGL restore',
    ],
    errors,
    failed,
  };
  fs.writeFileSync(
    `${out}/browser-report.json`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
