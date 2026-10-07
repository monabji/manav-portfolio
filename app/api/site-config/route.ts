import { readConfiguration } from '@/lib/site-store';
import { json } from '@/lib/admin-auth';
export async function GET() {
  try { return json(await readConfiguration()); }
  catch { console.error('Site configuration could not be read.'); return json({ error: 'Site settings are temporarily unavailable.' }, 503); }
}
