import { boundedBody, consumeAttempt, createSession, json, sameOrigin, sessionCookie, verifyPassword } from '@/lib/admin-auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Request rejected.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'Invalid request.' }, 415);
  try {
    const retry = await consumeAttempt(request);
    if (retry) return json({ error: retry === 10 ? 'Sign-in is busy. Please try again in 10 seconds.' : 'Too many attempts. Please try again in 15 minutes.' }, 429, { 'Retry-After': String(retry) });
    let password: unknown;
    try { ({ password } = JSON.parse(new TextDecoder().decode(await boundedBody(request, 1024)))); }
    catch { return json({ error: 'Invalid request.' }, 400); }
    if (typeof password !== 'string' || !password.length || password.length > 128 || !await verifyPassword(password)) return json({ error: 'Incorrect password.' }, 401);
    const token = await createSession();
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token, new URL(request.url).protocol === 'https:') });
  } catch { console.error('Administrator login could not be completed.'); return json({ error: 'Sign-in is temporarily unavailable. Please try again.' }, 503); }
}
