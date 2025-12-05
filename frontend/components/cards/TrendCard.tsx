'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { TrendSeries } from '@/lib/types';
import type { TooltipProps } from 'recharts';

interface TrendCardProps {
  series: TrendSeries;
}

interface TrendTooltipProps extends TooltipProps<number, string> {
  unit: string;
}

const TrendTooltip = ({ active, payload, label, unit }: TrendTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/70 bg-surface px-3 py-2 text-xs text-foreground shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-muted">
        {payload[0].value} {unit}
      </p>
    </div>
  );
};

const TrendCard = ({ series }: TrendCardProps) => {
  const maxValue = useMemo(
    () => Math.max(...series.data.map((point) => point.value)),
    [series.data]
  );

  return (
    <section className="focus-ring flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-surface p-6 shadow-soft">
      <header>
        <p className="text-xs uppercase tracking-wide text-muted">{series.subtitle}</p>
        <p className="text-2xl font-semibold text-foreground">{series.title}</p>
      </header>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series.data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.45} />
                <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              domain={[0, Math.ceil(maxValue / 5) * 5]}
            />
            <Tooltip content={<TrendTooltip unit={series.unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgb(var(--color-primary))"
              fill="url(#trendGradient)"
              strokeWidth={3}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TrendCard;

