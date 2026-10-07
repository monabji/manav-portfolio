import { database } from '@/db';
import { authorize, boundedBody, json, sameOrigin } from '@/lib/admin-auth';
import { validateSettings } from '@/lib/site-configuration';
import { readConfiguration } from '@/lib/site-store';
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Request rejected.' }, 403);
  try {
    if (!await authorize(request)) return json({ error: 'Your session expired. Sign in again before publishing.' }, 401);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'Invalid request.' }, 415);
    let raw: string;
    try { raw = new TextDecoder().decode(await boundedBody(request, 500000)); } catch { return json({ error: 'Settings are too large. Use image uploads or image URLs.' }, 413); }
    let settings, revision;
    try { const parsed = JSON.parse(raw); settings = validateSettings(parsed.settings); revision = parsed.revision; if (!Number.isInteger(revision) || revision < 0) throw new Error('Invalid revision.'); }
    catch (error) { return json({ error: error instanceof Error ? error.message : 'Invalid settings.' }, 400); }
    const updated = revision === 0
      ? await database().prepare('INSERT INTO site_configuration (id, value, revision, updated_at) VALUES (1, ?, 1, ?) ON CONFLICT(id) DO NOTHING RETURNING revision').bind(JSON.stringify(settings), Date.now()).first<{ revision: number }>()
      : await database().prepare('UPDATE site_configuration SET value = ?, revision = revision + 1, updated_at = ? WHERE id = 1 AND revision = ? RETURNING revision').bind(JSON.stringify(settings), Date.now(), revision).first<{ revision: number }>();
    if (!updated) return json({ error: 'Another dashboard saved changes. Reload before publishing to avoid overwriting them.' }, 409);
    return json(await readConfiguration());
  } catch { console.error('Site configuration could not be published.'); return json({ error: 'Publishing failed. Your draft has been kept; please try again.' }, 503); }
}
