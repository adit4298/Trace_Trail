'use client';

import clsx from 'clsx';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from 'lucide-react';
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

const getSparkline = (id: string) => sparklineMap[id] ?? [10, 12, 11, 15, 13, 16, 18, 17];

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

  const changeTone = metric.trend === 'up' ? 'text-emerald-300' : metric.trend === 'down' ? 'text-rose-300' : 'text-slate-400';
  const ChangeIcon = metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus;
  const clampedProgress = Math.min(1, Math.max(0, metric.progress));
  const sparkline = useMemo(() => getSparkline(metric.id), [metric.id]);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={() => onSelect?.(metric)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.(metric);
        }
      }}
      className={clsx(
        'group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 text-white shadow-[0_25px_60px_rgba(2,6,23,0.65)] backdrop-blur-3xl transition-transform duration-200',
        'hover:-translate-y-1 hover:border-cyan-200/40 hover:shadow-[0_35px_80px_rgba(6,182,212,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70',
        isActive && 'ring-2 ring-cyan-300/60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{metric.label}</p>
          {metric.annotation ? (
            <p className="text-[13px] text-slate-300/90">{metric.annotation}</p>
          ) : null}
        </div>
        <Tooltip
          content={
            <span className="flex items-center gap-1">
              {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Declining' : 'Steady'} •{' '}
              {metric.status ?? 'Last 24h trend'}
            </span>
          }
        >
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold',
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
        <p className="text-4xl font-semibold tracking-tight">{formattedValue}</p>
        {metric.status ? <p className="text-sm text-slate-300">{metric.status}</p> : null}
      </div>

      <div className="space-y-3">
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label={`${metric.label} progress`}
          aria-valuenow={Math.round(clampedProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={clsx(
              'absolute inset-y-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-[width] duration-500',
              metric.trend === 'down' && 'from-rose-400 via-orange-400 to-amber-400'
            )}
            style={{ width: `${clampedProgress * 100}%` }}
          />
        </div>
        <MiniSparkline data={sparkline} trend={metric.trend} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Target {metric.target.toLocaleString()}</span>
        <span className="inline-flex items-center gap-1 text-cyan-300">
          Inspect
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
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

  const strokeColor =
    trend === 'down' ? 'rgba(248,113,113,0.9)' : trend === 'up' ? 'rgba(94,234,212,0.9)' : 'rgba(148,163,184,0.9)';

  return (
    <svg viewBox="0 0 100 50" className="h-14 w-full">
      <defs>
        <linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,50 L${normalized.join(' ')} L100,50 Z`}
        fill="url(#sparklineGradient)"
        stroke="none"
        opacity={0.7}
      />
      <polyline
        points={normalized.join(' ')}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        className="animate-pulse-soft"
      />
    </svg>
  );
});

MiniSparkline.displayName = 'MiniSparkline';

