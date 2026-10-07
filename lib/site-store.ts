import 'server-only';
import { database } from '@/db';
import { defaultSettings, type DesktopSettings } from './site-configuration';
export async function readConfiguration(): Promise<{ settings: DesktopSettings; revision: number }> {
  const row = await database().prepare('SELECT value, revision FROM site_configuration WHERE id = 1').first<{ value: string; revision: number }>();
  return row ? { settings: JSON.parse(row.value), revision: row.revision } : { settings: defaultSettings, revision: 0 };
}
