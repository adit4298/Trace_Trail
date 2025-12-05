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
  critical: 'Worth a closer look. We can help you decide.'
};

export const ActivityDetailDrawer = ({ activity, open, onClose }: ActivityDetailDrawerProps) => {
  if (!activity) return null;
  const badgeText = severityCopy[activity.state]?.split('.')[0] ?? activity.state;

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="right"
      title={activity.action}
      subtitle={`Triggered by ${activity.actor}`}
      ariaLabel="Live activity details"
    >
      <div className="space-y-5 text-sm text-foreground">
        <div className="flex items-center gap-3">
          <Badge
            variant={
              activity.state === 'critical'
                ? 'critical'
                : activity.state === 'warning'
                  ? 'warning'
                  : activity.state === 'success'
                    ? 'success'
                    : 'info'
            }
          >
            {badgeText}
          </Badge>
          <span className="text-muted">
            {format(new Date(activity.timestamp), "MMM d, yyyy • HH:mm 'UTC'")}
          </span>
        </div>

        <p className="text-base text-foreground">{severityCopy[activity.state]}</p>

        <div className="rounded-[18px] border border-border/60 bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Context</p>
          <p className="text-sm text-foreground">{activity.context}</p>
        </div>

        <div className="rounded-[18px] border border-border/60 bg-surface-muted/70 p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Confidence</p>
          <p className="text-3xl font-semibold text-foreground">
            {activity.state === 'critical' ? '94%' : activity.state === 'warning' ? '82%' : '73%'}
          </p>
          <p className="text-xs text-muted">Composite of anomaly delta, friendly signals, and policy checks.</p>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            className="w-full rounded-[18px] bg-warning/80 px-4 py-3 font-semibold text-primary-foreground transition hover:bg-warning"
          >
            Escalate
          </button>
          <button
            type="button"
            className="w-full rounded-[18px] border border-border/60 px-4 py-3 font-semibold text-foreground transition hover:bg-surface-muted"
          >
            Dismiss
          </button>
          <button
            type="button"
            className="w-full rounded-[18px] border border-border/60 px-4 py-3 font-semibold text-foreground transition hover:bg-surface-muted"
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
};


