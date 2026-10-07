import 'server-only';
import { env } from 'cloudflare:workers';
export function database() {
  if (!env.DB) throw new Error('Site storage is unavailable.');
  return env.DB;
}
