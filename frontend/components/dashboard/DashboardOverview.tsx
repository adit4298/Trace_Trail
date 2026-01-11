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

  const riskMetric = snapshot.metrics.find((m) => m.id === 'risk-score');
  const healthScore = riskMetric ? parseFloat(riskMetric.value) : 42;
  const healthBreakdown = useHealthBreakdown(snapshot.metrics, snapshot.trends);

  return (
    <div className="space-y-6">
      {/* ================= METRICS ROW ================= */}
      <section className="relative">
        <div className="grid gap-4 xl:grid-cols-[220px_repeat(4,minmax(0,1fr))] items-stretch">
          {/* Avatar column — ISOLATED */}
          <div className="flex items-center justify-center">
            <SystemHealthAvatar
              score={healthScore}
              updatedAt={new Date()}
              breakdown={healthBreakdown}
            />
          </div>

          {/* Metric cards */}
          {snapshot.metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              onSelect={setSelectedMetric}
              isActive={selectedMetric?.id === metric.id}
            />
          ))}
        </div>
      </section>

      {/* ================= CHARTS ROW ================= */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
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

      {/* ================= MODALS ================= */}
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
      recommendations: []
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
