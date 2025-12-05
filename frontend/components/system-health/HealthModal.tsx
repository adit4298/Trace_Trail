'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

import type { HealthState } from './useHealthStatus';

export interface HealthBreakdown {
  anomalies: number;
  criticalAlerts: number;
  coverage: number;
  signalVolume: number;
  trend: number[];
  recommendations: string[];
}

interface HealthModalProps {
  open: boolean;
  onClose: () => void;
  score: number;
  label: string;
  state: HealthState;
  breakdown: HealthBreakdown;
}

export const HealthModal = ({ open, onClose, score, label, state, breakdown }: HealthModalProps) => {
  const trendData = breakdown.trend.map((value, index) => ({
    label: `-${trendOffset(index)}h`,
    value
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="System health overview"
      subtitle="A gentle snapshot of anomalies, alerts, coverage, and volume."
      variant="center"
      size="lg"
    >
      <div className="grid gap-6 text-sm text-foreground lg:grid-cols-2">
        <div className="rounded-[20px] border border-border/60 bg-surface p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Current score</p>
          <p className="text-5xl font-semibold text-foreground">{score.toFixed(1)}</p>
          <Badge
            variant={
              state === 'critical'
                ? 'critical'
                : state === 'warning'
                  ? 'warning'
                  : state === 'moderate'
                    ? 'info'
                    : 'success'
            }
          >
            {label}
          </Badge>
          <p className="mt-3 text-xs text-muted">Based on the last 30 minutes of helpful telemetry.</p>
        </div>

        <div className="rounded-[20px] border border-border/60 bg-surface p-4">
          <div className="h-48 w-full">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="healthTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(71,176,231,0.7)" />
                    <stop offset="100%" stopColor="rgba(71,176,231,0)" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="rgba(226,232,240,0.2)"
                  tick={{ fill: 'rgba(226,232,240,0.6)', fontSize: 12 }}
                />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <RechartsTooltip
                  content={({ payload }) =>
                    payload && payload[0] ? (
                      <div className="rounded-2xl border border-border/60 bg-surface px-3 py-2 text-xs text-foreground shadow-lg">
                        <p>{payload[0].payload.label}</p>
                        <p className="text-primary">{payload[0].value}</p>
                      </div>
                    ) : null
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(71,176,231,1)"
                  strokeWidth={3}
                  fill="url(#healthTrendGradient)"
                  activeDot={{ r: 5, fill: '#47B0E7', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <HealthStat label="Anomalies" value={breakdown.anomalies} />
        <HealthStat label="High-risk alerts" value={breakdown.criticalAlerts} />
        <HealthStat label="Coverage" value={`${Math.round(breakdown.coverage * 100)}%`} />
        <HealthStat label="Signal volume" value={`${breakdown.signalVolume.toLocaleString()} / min`} />
      </div>

      <div className="mt-6 rounded-[20px] border border-border/60 bg-surface p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Friendly tips</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          {breakdown.recommendations.map((rec) => (
            <li key={rec}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-[18px] border border-border/60 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
          onClick={onClose}
        >
          Close
        </button>
        <a
          href="/health"
          className="rounded-[18px] bg-primary/80 px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary"
        >
          Open Health Overview
        </a>
      </div>
    </Modal>
  );
};

const trendOffset = (index: number) => (index + 1) * 3;

const HealthStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-[18px] border border-border/60 bg-surface p-4">
    <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
    <p className="text-2xl font-semibold text-foreground">{value}</p>
  </div>
);


