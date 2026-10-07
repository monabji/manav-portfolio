// Run only against disposable local preview data; never the live portfolio.
import assert from 'node:assert/strict';
const base = process.env.ADMIN_TEST_ORIGIN || 'http://localhost:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Tests must run locally.');
const password = process.env.ADMIN_TEST_PASSWORD;
if (!password) throw new Error('Set ADMIN_TEST_PASSWORD for the local preview.');
const request = async (path, method = 'GET', data, cookie = '', origin = base) => {
  const response = await fetch(base + path, { method, headers: { ...(method !== 'GET' ? { Origin: origin, 'Content-Type': 'application/json' } : {}), Cookie: cookie }, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) });
  const text = await response.text(); let body; try { body = JSON.parse(text); } catch { body = text; }
  return { status: response.status, body, headers: response.headers };
};
const config = (await request('/api/site-config')).body;
assert.equal((await request('/dashboard')).body.includes('Administrator password'), true);
assert.equal((await request('/dashboard')).body.includes('Add experience'), false);
assert.equal((await request('/api/admin/config', 'PUT', config)).status, 401);
assert.equal((await request('/api/admin/login', 'POST', { password }, '', 'https://evil.invalid')).status, 403);
assert.equal((await request('/api/admin/login', 'POST', { password: 'incorrect-test-password' })).status, 401);
const login = await request('/api/admin/login', 'POST', { password });
assert.equal(login.status, 200, JSON.stringify(login.body));
const rawCookie = login.headers.get('set-cookie');
assert.match(rawCookie, /HttpOnly/); assert.match(rawCookie, /SameSite=Strict/); assert.match(rawCookie, /Max-Age=28800/);
const cookie = rawCookie.split(';')[0];
assert.equal((await request('/dashboard', 'GET', undefined, cookie)).body.includes('Add experience'), true);
const settings = structuredClone(config.settings);
settings.shortcuts.push({ id: 'security-test-app', label: 'Test app', href: 'https://example.com', icon: '/crystal/browser.png', mode: 'window' });
settings.experience.push({ role: 'Test role', organization: 'Test organization', logo: '/crystal/people.png', alt: 'Test logo' });
settings.softwareProjects.push({ title: 'Test project', status: 'Test', description: 'Temporary local smoke test.', tags: ['one', 'two'], links: [{ label: 'Repository', href: 'https://github.com/monabji' }], icon: '/crystal/projects.png' });
const badSettings = structuredClone(settings); badSettings.shortcuts[0].href = 'javascript:alert(1)';
assert.equal((await request('/api/admin/config', 'PUT', { settings: badSettings, revision: config.revision }, cookie)).status, 400);
const duplicate = structuredClone(settings); duplicate.shortcuts[duplicate.shortcuts.length - 1].id = 'notepad';
assert.equal((await request('/api/admin/config', 'PUT', { settings: duplicate, revision: config.revision }, cookie)).status, 400);
assert.equal((await request('/api/admin/config', 'PUT', { settings, revision: config.revision }, cookie, 'https://evil.invalid')).status, 403);
const saved = await request('/api/admin/config', 'PUT', { settings, revision: config.revision }, cookie);
assert.equal(saved.status, 200, JSON.stringify(saved.body));
try {
  const publicRead = (await request('/api/site-config')).body;
  assert.equal(publicRead.settings.softwareProjects.at(-1).title, 'Test project');
  assert.equal(publicRead.settings.experience.at(-1).role, 'Test role');
  assert.equal(publicRead.settings.shortcuts.at(-1).mode, 'window');
  assert.equal((await request('/api/admin/config', 'PUT', config, cookie)).status, 409);
} finally {
  const restored = await request('/api/admin/config', 'PUT', { settings: config.settings, revision: saved.body.revision }, cookie);
  assert.equal(restored.status, 200, 'Restore original content failed.');
}
assert.equal((await request('/api/admin/logout', 'POST', {}, cookie)).status, 200);
assert.equal((await request('/api/admin/config', 'PUT', config, cookie)).status, 401);
assert.equal((await request('/dashboard', 'GET', undefined, cookie)).body.includes('Add experience'), false);
const throttled = await Promise.all(Array.from({ length: 6 }, () => request('/api/admin/login', 'POST', { password: 'wrong' })));
assert.ok(throttled.some(response => response.status === 429));
console.log('PASS: locked dashboard, password verification, CSRF, safe content, live persistence, revisions, logout, and throttling.');
