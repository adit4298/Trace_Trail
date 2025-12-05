'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import type { Activity } from '@/lib/types';

interface ActivityDetailDrawerProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
}

const severityCopy: Record<Activity['state'], string> = {
  info: 'Heads up event. No action required.',
  success: 'Healthy automated mitigation recorded.',
  warning: 'Manual review recommended.',
  critical: 'Immediate response required.'
};

export const ActivityDetailDrawer = ({ activity, open, onClose }: ActivityDetailDrawerProps) => {
  if (!activity) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="right"
      title={activity.action}
      subtitle={`Triggered by ${activity.actor}`}
      ariaLabel="Live activity details"
    >
      <div className="space-y-5 text-sm text-slate-200">
        <div className="flex items-center gap-3">
          <Badge variant={activity.state === 'critical' ? 'critical' : activity.state === 'warning' ? 'warning' : activity.state === 'success' ? 'success' : 'info'}>
            {activity.state.toUpperCase()}
          </Badge>
          <span className="text-slate-400">
            {format(new Date(activity.timestamp), "MMM d, yyyy • HH:mm 'UTC'")}
          </span>
        </div>

        <p className="text-base text-white">{severityCopy[activity.state]}</p>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Context</p>
          <p className="text-sm text-white">{activity.context}</p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Confidence</p>
          <p className="text-3xl font-semibold text-white">
            {activity.state === 'critical' ? '94%' : activity.state === 'warning' ? '82%' : '73%'}
          </p>
          <p className="text-xs text-slate-400">Composite of anomaly delta, analyst feedback, and policy risk.</p>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500/80 to-orange-400/80 px-4 py-3 font-semibold text-white shadow-[0_25px_60px_rgba(248,113,113,0.35)] transition hover:brightness-110"
          >
            Escalate
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Dismiss
          </button>
          <button
            type="button"
            className="w-full rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
};


