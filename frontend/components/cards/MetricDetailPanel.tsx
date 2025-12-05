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
      subtitle="Gentle guidance to keep your household secure."
      variant="right"
    >
      <div className="space-y-6 text-sm text-foreground">
        <div className="rounded-[18px] border border-border/60 bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Current value</p>
          <p className="mt-2 text-4xl font-semibold text-foreground">{metric.value}</p>
          <p className="text-sm text-muted">Target {metric.target.toLocaleString()}</p>
          {metric.status ? <p className="mt-2 text-sm text-muted">{metric.status}</p> : null}
        </div>

        <div className="h-48 w-full rounded-[18px] border border-border/50 bg-surface p-3">
          <ResponsiveContainer>
            <AreaChart data={dataPoints} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="metricDetailGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(71,176,231,0.6)" />
                  <stop offset="100%" stopColor="rgba(71,176,231,0)" />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
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
                stroke="rgba(71,176,231,0.9)"
                strokeWidth={2.5}
                fill="url(#metricDetailGradient)"
                activeDot={{ r: 5, fill: '#47B0E7', strokeWidth: 0 }}
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

        <div className="rounded-[18px] border border-border/60 bg-surface p-4">
          <Badge variant="info" soft>
            Why this matters
          </Badge>
          <p className="mt-2 text-sm text-muted">
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
          className="inline-flex items-center justify-center rounded-[18px] bg-primary/80 px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
        >
          View details
        </a>
        <button
          type="button"
          className="rounded-[18px] border border-border/60 px-4 py-3 font-semibold text-foreground transition hover:bg-surface-muted"
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
  <div className="rounded-[16px] border border-border/60 bg-surface px-3 py-2">
    <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
    <p className="text-base font-semibold text-foreground">{value}</p>
  </div>
);


