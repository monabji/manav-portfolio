import assert from 'node:assert/strict';
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || 'playwright'
);
import { mkdir } from 'node:fs/promises';

const origin =
  process.env.PAGES_TEST_URL || 'https://monabji.github.io/manav-portfolio/';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE
    ? { executablePath: process.env.CHROME_EXECUTABLE }
    : {}),
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const failedRequests = [];
const badResponses = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('requestfailed', (request) =>
  failedRequests.push({
    url: request.url(),
    error: request.failure()?.errorText,
  }),
);
page.on('response', (response) => {
  if (response.status() >= 400)
    badResponses.push({ url: response.url(), status: response.status() });
});
await mkdir('outputs', { recursive: true });
try {
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.getByRole('heading', { name: 'Manav', exact: true }).waitFor();
  await page.screenshot({ path: 'outputs/pages-home.png' });
  for (const route of ['about', 'projects']) {
    await page.locator(`.taskbar-apps a[href$="/${route}"]`).click();
    await page.waitForURL(new URL(route, origin).href);
    await page.locator('.content-window').waitFor();
    assert.ok(
      (await page.title()).startsWith(route === 'about' ? 'About' : 'Projects'),
    );
    await page.waitForTimeout(600);
    const broken = await page
      .locator('img')
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.src),
      );
    assert.deepEqual(broken, [], `Broken images on ${route}`);
    if (route === 'projects') {
      await page.getByRole('button', { name: '3D showcase' }).click();
      await page.locator('.gallery-grid img').first().waitFor();
      await page
        .locator('.gallery-grid img')
        .first()
        .evaluate((image) => image.decode());
      assert.ok(
        page.url().includes('/manav-portfolio/projects'),
        'Projects route lost its GitHub Pages base path.',
      );
      await page.locator('.gallery-grid button').first().click();
      await page.getByRole('dialog', { name: 'Skull Landscape' }).waitFor();
      assert.ok(
        page
          .url()
          .includes('/manav-portfolio/projects?project=skull-landscape'),
        'Project detail URL lost its GitHub Pages base path.',
      );
      await page.keyboard.press('Escape');
      assert.ok(
        page.url().endsWith('/manav-portfolio/projects'),
        'Closing a project leaves the Pages base path.',
      );
      await page.getByRole('button', { name: 'Pictures', exact: true }).click();
      await page.getByRole('dialog', { name: 'Gallery window' }).waitFor();
      await page
        .locator('.utility-gallery .gallery-grid img')
        .first()
        .evaluate((image) => image.decode());
      const galleryImages = await page
        .locator('.utility-gallery .gallery-grid img')
        .count();
      assert.ok(
        galleryImages > 0,
        'Pictures library did not load any design images.',
      );
      const galleryBroken = await page
        .locator('.utility-gallery img')
        .evaluateAll((images) =>
          images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.src),
        );
      assert.deepEqual(galleryBroken, [], 'Broken images in Pictures library');
      await page
        .getByRole('link', { name: 'Open Skull Landscape in the 3D showcase' })
        .click();
      await page.getByRole('dialog', { name: 'Skull Landscape' }).waitFor();
      assert.ok(
        page
          .url()
          .includes('/manav-portfolio/projects?project=skull-landscape'),
        'Pictures image did not open its project within the Pages path.',
      );
      await page.keyboard.press('Escape');
      assert.ok(
        page.url().endsWith('/manav-portfolio/projects'),
        'Closing a project opened from Pictures leaves the Pages base path.',
      );
      await page
        .getByRole('dialog', { name: 'Gallery window' })
        .getByRole('button', { name: 'Close Gallery' })
        .click();
      await page.goto(new URL('projects?project=skull-landscape', origin).href);
      await page.getByRole('dialog', { name: 'Skull Landscape' }).waitFor();
      assert.ok(
        page
          .url()
          .includes('/manav-portfolio/projects?project=skull-landscape'),
        'Direct project deep link did not load.',
      );
      await page.keyboard.press('Escape');
    }
    await page.screenshot({ path: `outputs/pages-${route}.png` });
  }
  await page.goBack();
  await page.waitForURL(new URL('about', origin).href);
  await page.locator('.content-window').waitFor();
  console.log(
    JSON.stringify(
      {
        url: page.url(),
        title: await page.title(),
        errors,
        failedRequests,
        badResponses,
      },
      null,
      2,
    ),
  );
  assert.deepEqual(errors, [], 'Browser JavaScript errors');
  assert.deepEqual(failedRequests, [], 'Failed browser requests');
  assert.deepEqual(badResponses, [], 'HTTP errors in browser');
  console.log(
    'PASS: homepage renders, About and Projects navigation, design gallery images, project deep links, Pictures library, history back, and no runtime/network errors.',
  );
} finally {
  await browser.close();
}
