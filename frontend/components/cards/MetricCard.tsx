'use client';

import clsx from 'clsx';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  Lock,
  Minus,
  Radar,
  ShieldCheck
} from 'lucide-react';
import { memo, useMemo } from 'react';

import { Tooltip } from '@/components/ui/Tooltip';
import type { MetricSummary } from '@/lib/types';

interface MetricCardProps {
  metric: MetricSummary;
  onSelect?: (metric: MetricSummary) => void;
  isActive?: boolean;
}

const sparklineMap: Record<string, number[]> = {
  'risk-score': [34, 32, 29, 28, 27, 25, 23, 24],
  signals: [104, 120, 136, 128, 131, 138, 142, 146],
  coverage: [78, 80, 83, 84, 86, 85, 87, 88],
  alerts: [9, 10, 12, 11, 12, 13, 12, 12]
};

const metricIconMap: Record<string, typeof ShieldCheck> = {
  'risk-score': ShieldCheck,
  signals: Radar,
  coverage: Fingerprint,
  alerts: AlertTriangle
};

const metricCopyFallback: Record<string, string> = {
  'risk-score': 'Overall balance of detections and resolved alerts.',
  signals: 'Signals processed in the last sync window.',
  coverage: 'Percent of devices and accounts watched.',
  alerts: 'Items waiting for a quick review.'
};

const getSparkline = (id: string) =>
  sparklineMap[id] ?? [14, 16, 15, 18, 17, 19, 20, 22];

const formatValue = (value: string) => {
  const match = value.match(/^([\d.,]+)\s*(.*)$/);
  if (!match) return value;
  return `${match[1]}${match[2] ? ` ${match[2]}` : ''}`;
};

export const MetricCard = ({ metric, onSelect, isActive }: MetricCardProps) => {
  const formattedValue = useMemo(() => formatValue(metric.value), [metric.value]);

  const changeTone =
    metric.trend === 'up'
      ? 'text-success'
      : metric.trend === 'down'
        ? 'text-danger'
        : 'text-muted';

  const ChangeIcon =
    metric.trend === 'up'
      ? ArrowUpRight
      : metric.trend === 'down'
        ? ArrowDownRight
        : Minus;

  const clampedProgress = Math.min(1, Math.max(0, metric.progress));
  const sparkline = useMemo(() => getSparkline(metric.id), [metric.id]);
  const MetricIcon = metricIconMap[metric.id] ?? Lock;
  const helperCopy =
    metric.annotation ??
    metricCopyFallback[metric.id] ??
    'Live metric from your workspace.';

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect?.(metric)}
      className={clsx(
        'group relative flex flex-col gap-5 rounded-[18px] border border-border/60 bg-surface p-5 text-left shadow-[0_16px_35px_rgba(7,9,12,0.35)] transition',
        'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(7,9,12,0.38)]',
        isActive && 'ring-2 ring-primary/50'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MetricIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{metric.label}</p>
            <p className="text-xs text-muted">{helperCopy}</p>
          </div>
        </div>

        <Tooltip content={metric.status ?? 'Last 24h trend'}>
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold',
              changeTone
            )}
          >
            <ChangeIcon className="h-3.5 w-3.5" />
            {metric.change > 0 ? '+' : ''}
            {metric.change.toFixed(1)}%
          </span>
        </Tooltip>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-4xl font-semibold tracking-tight">
          {formattedValue}
        </p>
        {metric.status && <p className="text-sm text-muted">{metric.status}</p>}
      </div>

      <div className="space-y-3">
        <div className="relative h-1.5 w-full rounded-full bg-surface-muted">
          <span
            className={clsx(
              'absolute inset-y-0 rounded-full bg-primary',
              metric.trend === 'down' && 'bg-danger'
            )}
            style={{ width: `${clampedProgress * 100}%` }}
          />
        </div>
        <MiniSparkline data={sparkline} trend={metric.trend} />
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Target {metric.target.toLocaleString()}</span>
        <span className="inline-flex items-center gap-1 text-primary">
          Details <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
};

interface MiniSparklineProps {
  data: number[];
  trend: MetricSummary['trend'];
}

const MiniSparkline = memo(({ data, trend }: MiniSparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = ((v - min) / (max - min || 1)) * 50;
    return `${x},${50 - y}`;
  });

  const stroke =
    trend === 'down' ? '#D9534F' : trend === 'up' ? '#47B0E7' : '#6B7685';

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
