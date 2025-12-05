'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/components/ui/Badge';

import type { Activity } from '@/lib/types';
import type { ComponentProps } from 'react';

const severityMap: Record<
  Activity['state'],
  { label: string; badge: ComponentProps<typeof Badge>['variant'] }
> = {
  info: { label: 'FYI', badge: 'neutral' },
  success: { label: 'Auto-resolved', badge: 'success' },
  warning: { label: 'Needs review', badge: 'warning' },
  critical: { label: 'High risk', badge: 'critical' }
};

interface LiveActivityListProps {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
}

export const LiveActivityList = ({ activities, onSelect }: LiveActivityListProps) => (
  <div className="flex h-full flex-col gap-4 rounded-[20px] border border-border/60 bg-surface p-6 text-foreground shadow-[0_16px_30px_rgba(8,10,12,0.25)]">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Live Activity</p>
        <p className="text-xl font-semibold">Friendly updates</p>
      </div>
      <Badge variant="info" soft>
        Streaming
      </Badge>
    </div>

    <ul className="flex-1 space-y-3 overflow-hidden">
      {activities.map((activity, index) => {
        const severity = severityMap[activity.state];
        return (
          <li key={activity.id} className="animate-slide-up-soft" style={{ animationDelay: `${index * 80}ms` }}>
            <button
              type="button"
              onClick={() => onSelect(activity)}
              className={clsx(
                'w-full rounded-[16px] border border-border/60 bg-surface-muted/70 p-4 text-left transition hover:-translate-y-0.5 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={severity.badge}>{severity.label}</Badge>
                <span className="text-xs text-muted">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-3 text-base font-semibold text-foreground">{activity.action}</p>
              <p className="text-sm text-muted">{activity.context}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">{activity.actor}</p>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);


