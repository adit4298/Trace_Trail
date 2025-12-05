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
      subtitle="Composite signal derived from anomalies, alerts, coverage, and volume."
      variant="center"
      size="lg"
    >
      <div className="grid gap-6 text-sm text-slate-200 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Current score</p>
          <p className="text-5xl font-semibold text-white">{score.toFixed(1)}</p>
          <Badge variant={state === 'critical' ? 'critical' : state === 'warning' ? 'warning' : state === 'moderate' ? 'info' : 'success'}>
            {label}
          </Badge>
          <p className="mt-3 text-xs text-slate-400">Based on the last 30 minutes of telemetry.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="h-48 w-full">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="healthTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(94,234,212,0.8)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="rgba(226,232,240,0.3)"
                  tick={{ fill: 'rgba(226,232,240,0.6)', fontSize: 12 }}
                />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <RechartsTooltip
                  content={({ payload }) =>
                    payload && payload[0] ? (
                      <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white shadow-lg">
                        <p>{payload[0].payload.label}</p>
                        <p className="text-cyan-300">{payload[0].value}</p>
                      </div>
                    ) : null
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(94,234,212,1)"
                  strokeWidth={3}
                  fill="url(#healthTrendGradient)"
                  activeDot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <HealthStat label="Anomalies" value={breakdown.anomalies} />
        <HealthStat label="Critical alerts" value={breakdown.criticalAlerts} />
        <HealthStat label="Coverage" value={`${Math.round(breakdown.coverage * 100)}%`} />
        <HealthStat label="Signal volume" value={`${breakdown.signalVolume.toLocaleString()} / min`} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">AI Recommendations</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
          {breakdown.recommendations.map((rec) => (
            <li key={rec}>{rec}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          onClick={onClose}
        >
          Close
        </button>
        <a
          href="/health"
          className="rounded-2xl bg-gradient-to-r from-cyan-400/80 to-blue-500/80 px-4 py-3 text-sm font-semibold text-white shadow-[0_25px_60px_rgba(14,165,233,0.35)] transition hover:brightness-110"
        >
          Open Health Overview
        </a>
      </div>
    </Modal>
  );
};

const trendOffset = (index: number) => (index + 1) * 3;

const HealthStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
    <p className="text-2xl font-semibold text-white">{value}</p>
  </div>
);


