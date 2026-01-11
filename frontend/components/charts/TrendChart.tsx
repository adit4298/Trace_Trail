'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from 'recharts';

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
  const requestedPoints = RANGE_TO_POINTS[range];

  // 1️⃣ Sanitize data
  const cleanData = series.data.filter(
    (p) => typeof p.value === 'number' && Number.isFinite(p.value)
  );

  if (cleanData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-[20px] border border-border/60 bg-surface p-6 text-sm text-muted">
        No trend data available
      </div>
    );
  }

  // 2️⃣ Clamp range to available data
  const visiblePoints = Math.min(requestedPoints, cleanData.length);
  const sliced = cleanData.slice(cleanData.length - visiblePoints);
  const isClamped = visiblePoints < requestedPoints;

  const values = sliced.map((p) => p.value);
  const peakValue = Math.max(...values);
  const minValue = Math.min(...values);

  return (
    <div className="flex h-full flex-col gap-6 rounded-[20px] border border-border/60 bg-surface p-6 shadow-soft">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            {series.title}
          </p>
          <p className="text-xl font-semibold text-foreground">
            {series.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['24h', '7d', '14d', '30d'] as RangeOption[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${option === range
                ? 'border-primary bg-primary/15 text-foreground'
                : 'border-border/60 bg-surface-muted/70 text-muted hover:text-foreground'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
        <div>
          Peak <span className="text-foreground">{peakValue}</span> {series.unit}
        </div>
        <div>
          Floor <span className="text-foreground">{minValue}</span> {series.unit}
        </div>
        <Badge variant="info" soft>
          {isClamped ? `Last ${visiblePoints} points` : 'Live'}
        </Badge>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(71,176,231,0.6)" />
                <stop offset="100%" stopColor="rgba(71,176,231,0)" />
              </linearGradient>
            </defs>

            {/* Stabilized XAxis */}
            <XAxis
              dataKey="timestamp"
              interval="preserveStartEnd"
              tick={{ fill: 'rgba(226,232,240,0.6)', fontSize: 12 }}
              stroke="rgba(226,232,240,0.2)"
            />

            <YAxis
              hide
              domain={[
                Math.floor(minValue * 0.95),
                Math.ceil(peakValue * 1.05)
              ]}
            />

            <RechartsTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
              content={({ payload }) =>
                payload?.[0] ? (
                  <div className="rounded-2xl border border-border/60 bg-surface px-3 py-2 text-xs shadow-lg">
                    <p className="text-muted">
                      {payload[0].payload.timestamp}
                    </p>
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
              dot={false}
              activeDot={{ r: 5, fill: '#47B0E7', strokeWidth: 0 }}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
