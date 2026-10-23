import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE
    ? { executablePath: process.env.CHROME_EXECUTABLE }
    : {}),
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await mkdir('outputs', { recursive: true });
try {
  await page.goto(
    process.env.PAGES_TEST_URL || 'http://127.0.0.1:4173/manav-portfolio/',
    { waitUntil: 'networkidle' },
  );
  await page
    .locator('.desktop-icons')
    .getByRole('button', { name: 'DOOM', exact: true })
    .click();
  const window = page.locator('.utility-doom');
  await window.waitFor({ state: 'visible' });
  const player = window.frameLocator('iframe');
  await player.getByText('Click to start', { exact: true }).waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'outputs/doom-before-start.png' });
  // Playwright's cross-origin locator coordinates do not account for the
  // scaled iframe. Click its actual screen position, as a visitor would.
  const start = await player.getByText('Click to start', { exact: true }).evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  const frameBounds = await window.locator('iframe').boundingBox();
  await page.mouse.click(frameBounds.x + start.x * frameBounds.width / 680, frameBounds.y + start.y * frameBounds.height / 660);
  await player.locator('canvas').waitFor({ timeout: 30000 });
  // The remote DOSBox emulator has a separate boot phase after canvas creation.
  await page.waitForTimeout(40000);
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'outputs/doom-gameplay.png' });
  const canvas = player.locator('canvas');
  const before = await canvas.screenshot();
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(600);
  await page.keyboard.up('ArrowUp');
  await page.keyboard.down('s');
  await page.waitForTimeout(700);
  await page.keyboard.up('s');
  await page.waitForTimeout(400);
  const after = await canvas.screenshot();
  assert.ok(
    !before.equals(after),
    'Game screen must update after keyboard input',
  );
  await page.screenshot({ path: 'outputs/doom-input.png' });
  assert.ok(
    page.url().includes('/manav-portfolio/'),
    'Game must remain inside the OS',
  );
  await window
    .getByRole('button', { name: 'Reload game', exact: true })
    .click();
  await player
    .getByText('Click to start', { exact: true })
    .waitFor({ state: 'visible', timeout: 30000 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const bounds = await window.locator('iframe').boundingBox();
  assert.ok(
    bounds.width <= 390 && bounds.x >= 0,
    'Player must fit a narrow viewport',
  );
  await page.screenshot({ path: 'outputs/doom-mobile.png' });
  assert.deepEqual(errors, [], 'No JavaScript exceptions');
  console.log(
    'PASS: DOOM opens in the OS, boots, receives keyboard input, reloads, and fits a narrow viewport.',
  );
} finally {
  await browser.close();
}
