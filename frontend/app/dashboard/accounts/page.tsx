import { ConnectedAccounts } from '@/components/accounts/ConnectedAccounts';
import { AppShell } from '@/components/AppShell';
import { fetchDashboardSnapshot } from '@/lib/api';

export default async function AccountsRoute() {
  const snapshot = await fetchDashboardSnapshot();

  return (
    <AppShell navItems={snapshot.navigation} notifications={snapshot.notifications} user={snapshot.user}>
      <ConnectedAccounts />
    </AppShell>
  );
}


