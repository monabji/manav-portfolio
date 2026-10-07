import type { Metadata } from 'next';
import { PersonalDashboard } from '@/components/personal-dashboard';
import { DashboardLogin } from '@/components/dashboard-login';
import { cookies } from 'next/headers';
import { authenticated, cookieName } from '@/lib/admin-auth';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Personal desktop customization settings for Manav’s portfolio.',
};

export default async function DashboardPage() {
  const jar = await cookies();
  const token = jar.get(cookieName())?.value || (process.env.NODE_ENV === 'development' ? jar.get(cookieName(false))?.value : '') || '';
  let signedIn = false;
  try { signedIn = await authenticated(token); } catch { /* Fail closed if storage is unavailable. */ }
  return signedIn ? <PersonalDashboard /> : <DashboardLogin />;
}
