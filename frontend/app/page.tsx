import dynamic from 'next/dynamic';

import { ActivityTimeline } from '@/components/ActivityTimeline';
import { AppShell } from '@/components/AppShell';
import { ConnectionCard } from '@/components/ConnectionCard';
import { MetricCard } from '@/components/cards/MetricCard';
import { fetchDashboardSnapshot } from '@/lib/api';

const TrendCard = dynamic(() => import('@/components/cards/TrendCard'), {
  ssr: false,
  loading: () => (
    <div className="h-full rounded-2xl border border-border/60 bg-surface p-6 text-sm text-muted shadow-soft">
      Loading trend insights…
    </div>
  )
});

export default async function DashboardPage() {
  const snapshot = await fetchDashboardSnapshot();

  return (
    <AppShell
      navItems={snapshot.navigation}
      notifications={snapshot.notifications}
      user={snapshot.user}
    >
      <section aria-label="Key performance indicators" className="grid gap-6 lg:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TrendCard series={snapshot.trends} />
        <ActivityTimeline activities={snapshot.activities} />
      </section>

      <section aria-label="Connected partners" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </section>
    </AppShell>
  );
}

