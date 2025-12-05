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

const getSparkline = (id: string) => sparklineMap[id] ?? [14, 16, 15, 18, 17, 19, 20, 22];

const splitValue = (value: string) => {
  const match = value.match(/^([\d.,]+)\s*(.*)$/);
  if (!match) {
    return { numeric: Number(value) || 0, suffix: '' };
  }
  return {
    numeric: Number(match[1].replace(/,/g, '')) || 0,
    suffix: match[2]
  };
};

export const MetricCard = ({ metric, onSelect, isActive }: MetricCardProps) => {
  const { numeric, suffix } = useMemo(() => splitValue(metric.value), [metric.value]);
  const animatedValue = useCountUp(numeric);
  const formattedValue = useMemo(() => {
    if (suffix.trim() === 'k') {
      return `${animatedValue.toFixed(0)}k`;
    }
    if (suffix.includes('%')) {
      return `${animatedValue.toFixed(1)}%`;
    }
    const isWhole = Number.isInteger(numeric);
    return `${animatedValue.toFixed(isWhole ? 0 : 1)}${suffix ? ` ${suffix}` : ''}`;
  }, [animatedValue, suffix, numeric]);

  const changeTone =
    metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-danger' : 'text-muted';
  const ChangeIcon = metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus;
  const clampedProgress = Math.min(1, Math.max(0, metric.progress));
  const sparkline = useMemo(() => getSparkline(metric.id), [metric.id]);
  const MetricIcon = metricIconMap[metric.id] ?? Lock;
  const helperCopy = metric.annotation ?? metricCopyFallback[metric.id] ?? 'Live metric from your workspace.';

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect?.(metric)}
      className={clsx(
        'group relative flex flex-col gap-5 rounded-[18px] border border-border/60 bg-surface p-5 text-left text-foreground shadow-[0_16px_35px_rgba(7,9,12,0.35)] transition duration-200',
        'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(7,9,12,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        isActive && 'ring-2 ring-primary/50'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MetricIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{metric.label}</p>
            <p className="text-xs text-muted">{helperCopy}</p>
          </div>
        </div>
        <Tooltip
          content={
            <span className="flex items-center gap-1">
              {metric.trend === 'up'
                ? 'Improving'
                : metric.trend === 'down'
                  ? 'Easing back'
                  : 'Holding steady'}{' '}
              •{' '}
              {metric.status ?? 'Last 24h trend'}
            </span>
          }
        >
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface-muted/70 px-3 py-1 text-xs font-semibold',
              changeTone
            )}
          >
            <ChangeIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {metric.change > 0 ? '+' : ''}
            {metric.change.toFixed(1)}%
          </span>
        </Tooltip>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-4xl font-semibold tracking-tight">{formattedValue}</p>
        {metric.status ? <p className="text-sm text-muted">{metric.status}</p> : null}
      </div>

      <div className="space-y-3">
        <div
          className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-label={`${metric.label} progress`}
          aria-valuenow={Math.round(clampedProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={clsx(
              'absolute inset-y-0 rounded-full bg-primary transition-[width] duration-500',
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
          Details
          <ArrowRight className="h-3 w-3" />
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
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const normalized = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((point - minValue) / (maxValue - minValue || 1)) * 50;
    return `${x},${50 - y}`;
  });

  const strokeColor = trend === 'down' ? '#D9534F' : trend === 'up' ? '#47B0E7' : '#6B7685';

  return (
    <svg viewBox="0 0 100 50" className="h-16 w-full">
      <defs>
        <linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,50 L${normalized.join(' ')} L100,50 Z`}
        fill="url(#sparklineGradient)"
        stroke="none"
        opacity={0.8}
      />
      <polyline
        points={normalized.join(' ')}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2.3}
        strokeLinecap="round"
        className="animate-pulse-soft"
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';

