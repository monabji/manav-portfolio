// Server-only: this module must never be imported by Client Components.
import 'server-only';
import { env } from 'cloudflare:workers';
import { createHash, scrypt, timingSafeEqual, randomBytes } from 'node:crypto';
import { database } from '@/db';

const duration = 8 * 60 * 60;
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export function cookieName(secure = true) { return secure ? '__Host-manav-admin' : 'manav-admin-local'; }
export function sessionCookie(token: string, secure: boolean, expired = false) {
  return `${cookieName(secure)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${expired ? 0 : duration}${secure ? '; Secure' : ''}`;
}
export function sameOrigin(request: Request) {
  const requestedOrigin = new URL(request.url).origin;
  const expected = env.SITE_ORIGIN || requestedOrigin;
  return request.headers.get('Origin') === expected && !['cross-site', 'same-site'].includes(request.headers.get('Sec-Fetch-Site') || '');
}
export function tokenFromCookie(header: string | null, secure: boolean) {
  return header?.split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName(secure)}=`))?.split('=')[1] || '';
}
export async function authenticated(token: string) {
  if (!env.ADMIN_PASSWORD_HASH || !/^[a-f0-9]{64}$/.test(token)) return false;
  const row = await database().prepare('SELECT expires_at, credential_version FROM admin_sessions WHERE token_hash = ?').bind(digest(token)).first<{ expires_at: number; credential_version: string }>();
  return !!row && row.expires_at > Date.now() && row.credential_version === digest(env.ADMIN_PASSWORD_HASH);
}
export async function authorize(request: Request) {
  return authenticated(tokenFromCookie(request.headers.get('Cookie'), new URL(request.url).protocol === 'https:'));
}
export async function consumeAttempt(request: Request) {
  const now = Date.now();
  const ip = digest(request.headers.get('CF-Connecting-IP') || 'local');
  const rules = [{ key: `ip:${ip}`, max: 5, duration: 900000 }, { key: 'burst', max: 2, duration: 10000 }];
  for (const rule of rules) {
    const row = await database().prepare(`INSERT INTO admin_attempts (key, count, expires_at) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET count = CASE WHEN expires_at <= ? THEN 1 ELSE count + 1 END,
      expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END RETURNING count`).bind(rule.key, now + rule.duration, now, now).first<{ count: number }>();
    if (!row || row.count > rule.max) return rule.duration / 1000;
  }
  return 0;
}
export async function verifyPassword(password: string) {
  const saved = env.ADMIN_PASSWORD_HASH;
  if (!saved || !/^scrypt:16384:8:5:[a-f0-9]{32}:[a-f0-9]{64}$/.test(saved)) throw new Error('Administrator sign-in is not configured.');
  const parts = saved.split(':');
  const derived = await new Promise<Buffer>((resolve, reject) => scrypt(password, parts[4], 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
  return timingSafeEqual(derived, Buffer.from(parts[5], 'hex'));
}
export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await database().batch([
    database().prepare('DELETE FROM admin_sessions WHERE expires_at <= ? OR credential_version != ?').bind(Date.now(), digest(env.ADMIN_PASSWORD_HASH!)),
    database().prepare('INSERT INTO admin_sessions (token_hash, expires_at, credential_version) VALUES (?, ?, ?)').bind(digest(token), Date.now() + duration * 1000, digest(env.ADMIN_PASSWORD_HASH!)),
    database().prepare('DELETE FROM admin_attempts WHERE expires_at <= ?').bind(Date.now()),
  ]);
  return token;
}
export function json(value: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}
export async function boundedBody(request: Request, limit: number) {
  if (Number(request.headers.get('Content-Length')) > limit) throw new Error('Request is too large.');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > limit) { await reader.cancel(); throw new Error('Request is too large.'); }
    chunks.push(value);
  }
  const result = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}
