'use client';

import clsx from 'clsx';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useMemo } from 'react';

import type { MetricSummary } from '@/lib/types';

interface MetricCardProps {
  metric: MetricSummary;
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const { icon, tone } = useMemo(() => {
    if (metric.trend === 'up') {
      return { icon: ArrowUpRight, tone: 'text-success' as const };
    }

    if (metric.trend === 'down') {
      return { icon: ArrowDownRight, tone: 'text-danger' as const };
    }

    return { icon: Minus, tone: 'text-muted' as const };
  }, [metric.trend]);

  const formattedChange = useMemo(() => {
    const sign = metric.change > 0 ? '+' : '';
    return `${sign}${metric.change.toFixed(1)}%`;
  }, [metric.change]);

  const Icon = icon;
  const clampedProgress = useMemo(
    () => Math.min(1, Math.max(0, metric.progress)),
    [metric.progress]
  );

  return (
    <article
      className="focus-ring flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface p-6 shadow-soft transition hover:-translate-y-0.5"
      aria-live="polite"
      aria-label={metric.label}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{metric.label}</p>
          {metric.annotation ? <p className="text-xs text-muted">{metric.annotation}</p> : null}
        </div>
        <span
          className={clsx(
            'inline-flex items-center gap-1 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold',
            tone
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {formattedChange}
        </span>
      </div>

      <p className="text-4xl font-semibold tracking-tight text-foreground">{metric.value}</p>

      <div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{Math.round(metric.progress * 100)}%</span>
        </div>
        <div
          className="mt-2 h-2 rounded-full bg-border/60"
          role="progressbar"
          aria-label={`${metric.label} progress`}
          aria-valuenow={Math.round(clampedProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={clsx(
              'h-full rounded-full transition-all',
              metric.trend === 'down' ? 'bg-danger' : 'bg-primary'
            )}
            style={{ width: `${clampedProgress * 100}%` }}
          />
        </div>
      </div>
    </article>
  );
};

