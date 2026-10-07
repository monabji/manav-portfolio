import { env } from 'cloudflare:workers';
import { authorize, boundedBody, json, sameOrigin } from '@/lib/admin-auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Request rejected.' }, 403);
  try {
    if (!await authorize(request)) return json({ error: 'Sign in before uploading images.' }, 401);
    const type = request.headers.get('Content-Type') || '';
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(type)) return json({ error: 'Choose a PNG, JPEG, WebP, or GIF image.' }, 415);
    let b: Uint8Array;
    try { b = await boundedBody(request, 1500000); } catch { return json({ error: 'Choose an image under 1.5 MB.' }, 413); }
    if (!b.byteLength) return json({ error: 'Choose an image file.' }, 400);
    const valid = type === 'image/png' ? b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71 : type === 'image/jpeg' ? b[0] === 255 && b[1] === 216 && b[2] === 255 : type === 'image/gif' ? String.fromCharCode(...b.slice(0, 6)).startsWith('GIF8') : String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP';
    if (!valid) return json({ error: 'The file is not a supported image.' }, 400);
    const id = crypto.randomUUID();
    await env.BUCKET.put(`images/${id}`, b, { httpMetadata: { contentType: type } });
    return json({ url: `/api/media/${id}` });
  } catch { return json({ error: 'Image upload failed. Please try again.' }, 503); }
}
