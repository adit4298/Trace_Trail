'use client';

import { useMemo, useState } from 'react';

import { MetricCard } from '@/components/cards/MetricCard';
import { MetricDetailPanel } from '@/components/cards/MetricDetailPanel';
import { TrendChart } from '@/components/charts/TrendChart';
import { ActivityDetailDrawer } from '@/components/live-activity/ActivityDetailDrawer';
import { LiveActivityList } from '@/components/live-activity/LiveActivityList';
import { SystemHealthAvatar } from '@/components/system-health/SystemHealthAvatar';

import type { Activity, DashboardSnapshot, MetricSummary, TrendSeries } from '@/lib/types';

type RangeOption = '24h' | '7d' | '14d' | '30d';

interface DashboardOverviewProps {
  snapshot: DashboardSnapshot;
}

export const DashboardOverview = ({ snapshot }: DashboardOverviewProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricSummary | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [chartRange, setChartRange] = useState<RangeOption>('14d');

  const riskMetric = snapshot.metrics.find((metric) => metric.id === 'risk-score');
  const healthScore = riskMetric ? parseFloat(riskMetric.value) : 42;
  const healthBreakdown = useHealthBreakdown(snapshot.metrics, snapshot.trends);

  const quickActions = [
    { id: 'link', label: 'Link Accounts', helper: 'Connect Google, Meta, X', href: '/dashboard/accounts' },
    { id: 'insights', label: 'View Insights', helper: 'Monitor anomalies', href: '/insights' },
    { id: 'signals', label: 'Check Signals', helper: 'See live events', href: '/signals' }
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="rounded-3xl border border-white/5 bg-surface/70 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Your Security Companion</h1>
            <p className="mt-2 text-base text-muted">
              Keep your digital footprint safe with live telemetry, human-friendly insights, and always-on monitoring.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <a
                key={action.id}
                href={action.href}
                className="min-w-[160px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-foreground transition hover:border-white/30 hover:bg-white/10"
              >
                <span className="block font-semibold">{action.label}</span>
                <span className="text-xs text-muted">{action.helper}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts overview */}
      <section className="rounded-3xl border border-white/5 bg-surface/70 p-6 shadow-soft">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted/70">Accounts Overview</p>
            <h2 className="text-xl font-semibold text-foreground">Manage and sync your connected platforms.</h2>
            <p className="text-sm text-muted">Each linked account unlocks richer insights and better coverage.</p>
          </div>
          <a
            href="/dashboard/accounts"
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary hover:bg-primary/20"
          >
            Manage Accounts
          </a>
        </header>

        <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm text-muted">
          Data will appear once accounts are connected.
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {['Insights intelligence', 'Telemetry coverage', 'Footprint tracking', 'Live signals'].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/5 bg-surface-muted/60 px-4 py-3 text-sm"
            >
              <p className="font-semibold">{item}</p>
              <p className="text-xs text-muted">Powered by your connected accounts.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics + Health avatar (FIXED) */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {/* System health avatar now lives IN the grid */}
        <div className="xl:col-span-1">
          <SystemHealthAvatar
            score={healthScore}
            updatedAt={new Date()}
            breakdown={healthBreakdown}
          />
        </div>

        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onSelect={setSelectedMetric}
            isActive={selectedMetric?.id === metric.id}
          />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TrendChart series={snapshot.trends} range={chartRange} onRangeChange={setChartRange} />
        <LiveActivityList activities={snapshot.activities} onSelect={setSelectedActivity} />
      </section>

      <MetricDetailPanel metric={selectedMetric} open={!!selectedMetric} onClose={() => setSelectedMetric(null)} />
      <ActivityDetailDrawer activity={selectedActivity} open={!!selectedActivity} onClose={() => setSelectedActivity(null)} />

      <footer className="pt-4 text-center text-xs text-muted/80">
        © 2025 TraceTrail — Security Companion
      </footer>
    </div>
  );
};

const useHealthBreakdown = (metrics: MetricSummary[], trends: TrendSeries) =>
  useMemo(() => {
    const anomalies = trends.data.at(-1)?.value ?? 24;
    const criticalAlerts = parseValue(metrics.find((m) => m.id === 'alerts')?.value ?? '12');
    const coverage = parseValue(metrics.find((m) => m.id === 'coverage')?.value ?? '86') / 100;
    const signalVolume = parseValue(metrics.find((m) => m.id === 'signals')?.value ?? '120k');

    return {
      anomalies,
      criticalAlerts,
      coverage,
      signalVolume,
      trend: trends.data.slice(-10).map((p) => p.value),
      recommendations: [
        'Give the APAC login spike a quick look.',
        'Let Signal Copilot auto-triage lower confidence events.',
        'Extend device coverage in EMEA.'
      ]
    };
  }, [metrics, trends]);

const parseValue = (value: string) => {
  const match = value.match(/^([\d.]+)\s*(k|m|%)?/i);
  if (!match) return Number(value) || 0;
  const base = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === 'k') return base * 1_000;
  if (unit === 'm') return base * 1_000_000;
  return base;
};
