import { AppShell } from '@/components/AppShell';
import { fetchDashboardSnapshot } from '@/lib/api';

export default async function SettingsPage() {
  const snapshot = await fetchDashboardSnapshot();

  return (
    <AppShell navItems={snapshot.navigation} notifications={snapshot.notifications} user={snapshot.user}>
      <div className="space-y-8">
        <header className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted">Manage your TraceTrail preferences and account settings.</p>
        </header>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          <p className="mt-2 text-sm text-muted">Settings coming soon.</p>
          <p className="mt-4 text-sm text-muted">
            You can manage your connected accounts in{' '}
            <a href="/dashboard/accounts" className="text-primary hover:underline">
              Connected Accounts
            </a>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="mt-2 text-sm text-muted">Customize your TraceTrail experience.</p>
          <a
            href="/settings/preferences"
            className="mt-4 inline-block rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            Go to Preferences →
          </a>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <p className="mt-2 text-sm text-muted">Notification settings coming soon.</p>
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="mt-2 text-sm text-muted">Security settings coming soon.</p>
        </section>
      </div>
    </AppShell>
  );
}

