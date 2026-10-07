import { database } from '@/db';
import { digest, json, sameOrigin, sessionCookie, tokenFromCookie } from '@/lib/admin-auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Request rejected.' }, 403);
  const secure = new URL(request.url).protocol === 'https:';
  try {
    await database().prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(digest(tokenFromCookie(request.headers.get('Cookie'), secure))).run();
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', secure, true) });
  } catch { return json({ error: 'Could not sign out. Please try again.' }, 503); }
}
