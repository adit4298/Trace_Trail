'use client';

import clsx from 'clsx';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Fingerprint,
  Lock,
  Minus,
  Radar,
  ShieldCheck
} from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';

import { Tooltip } from '@/components/ui/Tooltip';
import { useCountUp } from '@/hooks/useCountUp';
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

const splitValue = (value: string) => {
  const match = value.match(/^([\d.,]+)\s*(.*)$/);
  if (!match) {
    return { numeric: 0, suffix: '' };
  }

  return {
    numeric: Number(match[1].replace(/,/g, '')),
    suffix: match[2]
  };
};

export const MetricCard = ({ metric, onSelect, isActive }: MetricCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { numeric, suffix } = useMemo(
    () => splitValue(metric.value),
    [metric.value]
  );

  // ✅ Hook is ALWAYS called
  const animatedValue = useCountUp(numeric);

  // ✅ We decide what to DISPLAY, not what hook to call
  const displayValue = mounted ? animatedValue : numeric;

  const formattedValue = useMemo(() => {
    if (suffix.trim() === 'k') return `${displayValue.toFixed(0)}k`;
    if (suffix.includes('%')) return `${displayValue.toFixed(1)}%`;
    return displayValue.toFixed(Number.isInteger(numeric) ? 0 : 1);
  }, [displayValue, numeric, suffix]);

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
  const sparkline = sparklineMap[metric.id] ?? [];
  const MetricIcon = metricIconMap[metric.id] ?? Lock;
  const helperCopy =
    metric.annotation ??
    metricCopyFallback[metric.id] ??
    'Live metric from your workspace.';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(metric)}
      aria-pressed={isActive}
      className={clsx(
        'group relative flex flex-col gap-5 rounded-[18px] border border-border/60 bg-surface p-5 text-left shadow transition',
        isActive && 'ring-2 ring-primary/50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MetricIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{metric.label}</p>
            <p className="text-xs text-muted">{helperCopy}</p>
          </div>
        </div>

        <Tooltip content={metric.status ?? 'Last 24h'}>
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
              changeTone
            )}
          >
            <ChangeIcon className="h-3.5 w-3.5" />
            {metric.change > 0 ? '+' : ''}
            {metric.change.toFixed(1)}%
          </span>
        </Tooltip>
      </div>

      <p className="text-4xl font-semibold">{formattedValue}</p>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
        <span
          className="block h-full bg-primary transition-all"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>

      <MiniSparkline data={sparkline} trend={metric.trend} />
    </button>
  );
};

interface MiniSparklineProps {
  data: number[];
  trend: MetricSummary['trend'];
}

const MiniSparkline = memo(({ data, trend }: MiniSparklineProps) => {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${50 - ((v - min) / (max - min || 1)) * 50}`
    )
    .join(' ');

  const color =
    trend === 'down' ? '#D9534F' : trend === 'up' ? '#47B0E7' : '#6B7685';

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';
