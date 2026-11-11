import { readConfiguration } from '@/lib/site-store';
export async function GET() {
  try { return Response.json(await readConfiguration(), { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
  catch { console.error('Site configuration could not be read.'); return Response.json({ error: 'Site settings are temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
}
