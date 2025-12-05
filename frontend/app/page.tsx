import { AppShell } from '@/components/AppShell';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { fetchDashboardSnapshot } from '@/lib/api';

export default async function DashboardPage() {
  const snapshot = await fetchDashboardSnapshot();

  return (
    <AppShell
      navItems={snapshot.navigation}
      notifications={snapshot.notifications}
      user={snapshot.user}
    >
      <DashboardOverview snapshot={snapshot} />
    </AppShell>
  );
}

