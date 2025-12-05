'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

import type { Activity } from '@/lib/types';

interface ActivityTimelineProps {
  activities: Activity[];
}

const stateColorMap: Record<Activity['state'], string> = {
  success: 'bg-success/20 text-success border-success/40',
  info: 'bg-primary/10 text-primary border-primary/30',
  warning: 'bg-warning/20 text-warning border-warning/40',
  critical: 'bg-danger/20 text-danger border-danger/40'
};

export const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  return (
    <section
      aria-label="Recent activity"
      className="focus-ring rounded-2xl border border-border/60 bg-surface p-6 shadow-soft"
    >
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Live Activity</p>
          <p className="text-xl font-semibold text-foreground">Investigations & signals</p>
        </div>
        <span className="text-xs font-medium text-muted">Updated moments ago</span>
      </header>

      <ol className="space-y-6">
        {activities.map((activity, index) => (
          <li key={activity.id} className="relative border-l border-border/60 pl-6">
            <span
              className={clsx(
                'absolute -left-[11px] top-3 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold',
                stateColorMap[activity.state]
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-foreground">{activity.actor}</span>
                <span aria-hidden="true">•</span>
                <span>
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true
                  })}
                </span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {activity.state}
                </span>
              </div>
              <p className="text-sm text-foreground">{activity.action}</p>
              <p className="text-xs text-muted">{activity.context}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

