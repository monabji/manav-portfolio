import type { Metadata } from 'next';
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Personal desktop customization settings for Manav’s portfolio.',
};

export default function DashboardPage() {
  return <main className="route-stage" id="main-content"><section className="aero-window"><h1>Dashboard</h1><p>The editing dashboard requires a live server and is not available on this static portfolio.</p></section></main>;
}
