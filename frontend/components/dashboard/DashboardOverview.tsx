'use client';

import { useState } from 'react';

import { MetricCard } from '@/components/cards/MetricCard';
import { MetricDetailPanel } from '@/components/cards/MetricDetailPanel';
import { TrendChart } from '@/components/charts/TrendChart';
import { ActivityDetailDrawer } from '@/components/live-activity/ActivityDetailDrawer';
import { LiveActivityList } from '@/components/live-activity/LiveActivityList';

import type { Activity, DashboardSnapshot, MetricSummary } from '@/lib/types';

type RangeOption = '24h' | '7d' | '14d' | '30d';

interface DashboardOverviewProps {
  snapshot: DashboardSnapshot;
}

export const DashboardOverview = ({ snapshot }: DashboardOverviewProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricSummary | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [chartRange, setChartRange] = useState<RangeOption>('14d');

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="rounded-3xl border border-white/5 bg-surface/70 p-6 shadow-soft backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">
              Welcome back
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">
              Your Security Companion
            </h1>
            <p className="mt-2 max-w-xl text-base text-muted">
              Keep your digital footprint safe with live telemetry, human-friendly insights,
              and always-on monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="/dashboard/accounts"
              className="flex min-w-[200px] flex-col rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm text-foreground shadow-soft transition hover:border-primary/40 hover:bg-surface-muted"
            >
              <span className="font-semibold">Link Accounts</span>
              <span className="text-xs text-muted">Connect Google, Meta, X</span>
            </a>

            <a
              href="/insights"
              className="flex min-w-[200px] flex-col rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm text-foreground shadow-soft transition hover:border-primary/40 hover:bg-surface-muted"
            >
              <span className="font-semibold">View Insights</span>
              <span className="text-xs text-muted">Monitor anomalies</span>
            </a>

            <a
              href="/signals"
              className="flex min-w-[200px] flex-col rounded-2xl border border-border/60 bg-surface px-5 py-4 text-sm text-foreground shadow-soft transition hover:border-primary/40 hover:bg-surface-muted sm:col-span-2"
            >
              <span className="font-semibold">Check Signals</span>
              <span className="text-xs text-muted">See live events</span>
            </a>
          </div>
        </div>
      </section>

      {/* Accounts overview */}
      <section className="rounded-3xl border border-white/5 bg-surface/70 p-6 shadow-soft">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted/70">
              Accounts Overview
            </p>
            <h2 className="text-xl font-semibold text-foreground">
              Manage and sync your connected platforms.
            </h2>
            <p className="text-sm text-muted">
              Each linked account unlocks richer insights and better coverage.
            </p>
          </div>

          <a
            href="/dashboard/accounts"
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary hover:bg-primary/20"
          >
            Manage Accounts
          </a>
        </header>
      </section>

      {/* Metrics row */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onSelect={setSelectedMetric}
            isActive={selectedMetric?.id === metric.id}
          />
        ))}
      </section>

      {/* Charts + activity */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TrendChart
          series={snapshot.trends}
          range={chartRange}
          onRangeChange={setChartRange}
        />
        <LiveActivityList
          activities={snapshot.activities}
          onSelect={setSelectedActivity}
        />
      </section>

      <MetricDetailPanel
        metric={selectedMetric}
        open={Boolean(selectedMetric)}
        onClose={() => setSelectedMetric(null)}
      />

      <ActivityDetailDrawer
        activity={selectedActivity}
        open={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
      />

      <footer className="pt-4 text-center text-xs text-muted/80">
        © 2025 TraceTrail — Security Companion
      </footer>
    </div>
  );
};
