'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/Badge';

import type { TrendSeries } from '@/lib/types';

type RangeOption = '24h' | '7d' | '14d' | '30d';

const RANGE_TO_POINTS: Record<RangeOption, number> = {
  '24h': 6,
  '7d': 7,
  '14d': 14,
  '30d': 30
};

interface TrendChartProps {
  series: TrendSeries;
  range: RangeOption;
  onRangeChange: (value: RangeOption) => void;
}

export const TrendChart = ({ series, range, onRangeChange }: TrendChartProps) => {
  const totalPoints = RANGE_TO_POINTS[range];
  const baseData = series.data;
  const sliced =
    totalPoints >= baseData.length ? baseData : baseData.slice(baseData.length - totalPoints);

  const peakValue = Math.max(...sliced.map((point) => point.value));
  const minValue = Math.min(...sliced.map((point) => point.value));

  return (
    <div className="flex h-full flex-col gap-6 rounded-[20px] border border-border/60 bg-surface p-6 text-foreground shadow-[0_16px_30px_rgba(8,10,12,0.25)]">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">{series.title}</p>
          <p className="text-xl font-semibold text-foreground">{series.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {(['24h', '7d', '14d', '30d'] as RangeOption[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                option === range
                  ? 'border-primary bg-primary/15 text-foreground'
                  : 'border-border/60 bg-surface-muted/70 text-muted hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-4 text-sm text-muted">
        <div>
          Peak <span className="text-foreground">{peakValue}</span> {series.unit}
        </div>
        <div>
          Floor <span className="text-foreground">{minValue}</span> {series.unit}
        </div>
        <Badge variant="info" soft>
          Live
        </Badge>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(71,176,231,0.6)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="rgba(71,176,231,0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              stroke="rgba(226,232,240,0.2)"
              tick={{ fill: 'rgba(226,232,240,0.6)', fontSize: 12 }}
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <RechartsTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
              content={({ payload }) =>
                payload && payload[0] ? (
                  <div className="rounded-2xl border border-border/60 bg-surface px-3 py-2 text-xs text-foreground shadow-lg">
                    <p className="text-muted">{payload[0].payload.timestamp}</p>
                    <p className="text-primary">
                      {payload[0].value} {series.unit}
                    </p>
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgba(71,176,231,1)"
              strokeWidth={3}
              fill="url(#trendGradient)"
              animationDuration={600}
              dot={false}
              activeDot={{ r: 5, fill: '#47B0E7', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


