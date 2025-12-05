'use client';

import { useMemo, useState } from 'react';

import { MetricCard } from '@/components/cards/MetricCard';
import { MetricDetailPanel } from '@/components/cards/MetricDetailPanel';
import { ActivityDetailDrawer } from '@/components/live-activity/ActivityDetailDrawer';
import { LiveActivityList } from '@/components/live-activity/LiveActivityList';
import { TrendChart } from '@/components/charts/TrendChart';
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

  return (
    <div className="space-y-6">
      <section aria-label="Key metrics" className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onSelect={setSelectedMetric}
            isActive={selectedMetric?.id === metric.id}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TrendChart series={snapshot.trends} range={chartRange} onRangeChange={setChartRange} />
        <LiveActivityList activities={snapshot.activities} onSelect={setSelectedActivity} />
      </section>

      <MetricDetailPanel metric={selectedMetric} open={Boolean(selectedMetric)} onClose={() => setSelectedMetric(null)} />

      <ActivityDetailDrawer
        activity={selectedActivity}
        open={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
      />

      <SystemHealthAvatar
        score={healthScore}
        updatedAt={new Date()}
        breakdown={healthBreakdown}
      />
    </div>
  );
};

const useHealthBreakdown = (metrics: MetricSummary[], trends: TrendSeries) =>
  useMemo(() => {
    const anomalies = trends.data.at(-1)?.value ?? 24;
    const criticalAlerts = parseValue(metrics.find((m) => m.id === 'alerts')?.value ?? '12');
    const coverage = parseValue(metrics.find((m) => m.id === 'coverage')?.value ?? '0.86') / 100;
    const signalVolume = parseValue(metrics.find((m) => m.id === 'signals')?.value ?? '120k');

    return {
      anomalies,
      criticalAlerts,
      coverage: Number.isFinite(coverage) ? coverage : 0.86,
      signalVolume,
      trend: trends.data.slice(-10).map((point) => point.value),
      recommendations: [
        'Investigate APAC login spike impacting MFA success.',
        'Route low-confidence anomalies to Copilot for auto-triage.',
        'Boost collector coverage in EMEA edge locations.'
      ]
    };
  }, [metrics, trends.data]);

const parseValue = (value: string) => {
  const match = value.match(/^([\d.]+)\s*(k|m|%)?/i);
  if (!match) return Number(value) || 0;
  const base = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === 'k') return base * 1_000;
  if (unit === 'm') return base * 1_000_000;
  if (unit === '%') return base;
  return base;
};


