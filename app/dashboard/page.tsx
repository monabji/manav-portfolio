import type { Metadata } from 'next';
import { PersonalDashboard } from '@/components/personal-dashboard';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Personal desktop customization settings for Manav’s portfolio.',
};

export default function DashboardPage() {
  return <PersonalDashboard />;
}
