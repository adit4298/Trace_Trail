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
    <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(3,7,18,0.65)] backdrop-blur-3xl">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{series.title}</p>
          <p className="text-xl font-semibold text-white">{series.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {(['24h', '7d', '14d', '30d'] as RangeOption[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                option === range
                  ? 'border-cyan-300/60 bg-cyan-400/20 text-white'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <div>
          Peak <span className="text-white">{peakValue}</span> {series.unit}
        </div>
        <div>
          Floor <span className="text-white">{minValue}</span> {series.unit}
        </div>
        <Badge variant="info">Live</Badge>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(94,234,212,0.9)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="rgba(14,165,233,0.05)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              stroke="rgba(226,232,240,0.3)"
              tick={{ fill: 'rgba(226,232,240,0.6)', fontSize: 12 }}
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <RechartsTooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              content={({ payload }) =>
                payload && payload[0] ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white shadow-lg">
                    <p className="text-slate-300">{payload[0].payload.timestamp}</p>
                    <p className="text-cyan-300">
                      {payload[0].value} {series.unit}
                    </p>
                  </div>
                ) : null
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgba(94,234,212,1)"
              strokeWidth={3}
              fill="url(#trendGradient)"
              animationDuration={600}
              dot={false}
              activeDot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


