import { AppShell } from '@/components/AppShell';
import { fetchDashboardSnapshot } from '@/lib/api';

// Force dynamic rendering to prevent build-time API calls
export const dynamic = 'force-dynamic';

export default async function PreferencesPage() {
  const snapshot = await fetchDashboardSnapshot();

  return (
    <AppShell navItems={snapshot.navigation} notifications={snapshot.notifications} user={snapshot.user}>
      <div className="space-y-8">
        <header className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <a
              href="/settings"
              className="transition text-muted hover:text-foreground"
              aria-label="Back to Settings"
            >
              ←
            </a>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Preferences</h1>
              <p className="mt-2 text-sm text-muted">Customize your TraceTrail experience.</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          <p className="mt-2 text-sm text-muted">Theme preferences are managed via the theme toggle in the top navigation.</p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          <p className="mt-2 text-sm text-muted">Dashboard preferences coming soon.</p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
          <p className="mt-2 text-sm text-muted">Data and privacy preferences coming soon.</p>
        </section>
      </div>
    </AppShell>
  );
}

