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
import { Modal } from '@/components/ui/Modal';
import type { MetricSummary } from '@/lib/types';

const detailRoutes: Record<string, string> = {
  'risk-score': '/reports/risk',
  signals: '/signals',
  coverage: '/reports/coverage',
  alerts: '/investigations'
};

interface MetricDetailPanelProps {
  metric: MetricSummary | null;
  open: boolean;
  onClose: () => void;
}

export const MetricDetailPanel = ({ metric, open, onClose }: MetricDetailPanelProps) => {
  if (!metric) {
    return null;
  }

  const dataPoints = getDetailSeries(metric.id);
  const destination = detailRoutes[metric.id] ?? '/';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${metric.label} insights`}
      subtitle="Live signal blend of telemetry, anomalies, and analyst feedback."
      variant="right"
    >
      <div className="space-y-6 text-sm text-slate-200">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Current value</p>
          <p className="mt-1 text-4xl font-semibold text-white">{metric.value}</p>
          <p className="text-sm text-slate-400">Target {metric.target.toLocaleString()}</p>
          {metric.status ? <p className="mt-2 text-sm text-slate-300">{metric.status}</p> : null}
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer>
            <AreaChart data={dataPoints} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="metricDetailGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(45,212,191,0.9)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" />
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
                stroke="rgba(45,212,191,0.95)"
                strokeWidth={2}
                fill="url(#metricDetailGradient)"
                activeDot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Day trend" value={`${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%`} />
          <Stat
            label="Stability"
            value={metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'At risk' : 'Steady'}
          />
          <Stat label="Progress" value={`${Math.round(metric.progress * 100)}%`} />
          <Stat label="Annotation" value={metric.annotation ?? 'No annotation'} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4">
          <Badge variant="info">AI Recommendation</Badge>
          <p className="mt-2 text-sm">
            {metric.id === 'risk-score'
              ? 'Risk profile dropping. Keep prioritizing APAC anomaly investigation to lock in gains.'
              : metric.id === 'signals'
                ? 'Signal throughput is surging. Route excess to Signal Copilot for automatic clustering.'
                : metric.id === 'coverage'
                  ? 'Coverage is approaching the 90% goal. Focus deployment enablement in EMEA data centers.'
                  : 'Critical alerts plateaued. Review Tier-2 backlog to unblock closure.'}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-sm">
        <a
          href={destination}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400/80 to-blue-500/80 px-4 py-3 font-semibold text-white shadow-[0_25px_60px_rgba(14,165,233,0.35)] transition hover:brightness-110"
        >
          View details
        </a>
        <button
          type="button"
          className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const getDetailSeries = (metricId: string) => {
  const base = sparklineMap[metricId] ?? [32, 34, 31, 37, 33, 38, 36, 39];
  return base.map((value, index) => ({
    label: `T-${base.length - index}`,
    value
  }));
};

const sparklineMap: Record<string, number[]> = {
  'risk-score': [34, 32, 31, 30, 29, 26, 25, 23],
  signals: [101, 110, 118, 124, 133, 138, 141, 145],
  coverage: [78, 80, 82, 84, 85, 86, 87, 88],
  alerts: [15, 14, 13, 13, 12, 12, 12, 11]
};

interface StatProps {
  label: string;
  value: string | number;
}

const Stat = ({ label, value }: StatProps) => (
  <div className="rounded-2xl border border-white/5 bg-white/5 px-3 py-2">
    <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-base font-semibold text-white">{value}</p>
  </div>
);


