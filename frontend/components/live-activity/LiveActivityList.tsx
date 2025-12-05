'use client';

import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import type { ComponentProps } from 'react';

import { Badge } from '@/components/ui/Badge';
import type { Activity } from '@/lib/types';

const severityMap: Record<Activity['state'], { label: string; badge: ComponentProps<typeof Badge>['variant'] }> = {
  info: { label: 'Info', badge: 'info' },
  success: { label: 'Success', badge: 'success' },
  warning: { label: 'Warning', badge: 'warning' },
  critical: { label: 'Critical', badge: 'critical' }
};

interface LiveActivityListProps {
  activities: Activity[];
  onSelect: (activity: Activity) => void;
}

export const LiveActivityList = ({ activities, onSelect }: LiveActivityListProps) => (
  <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(3,7,18,0.65)] backdrop-blur-3xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live Activity</p>
        <p className="text-xl font-semibold">Investigations & Signals</p>
      </div>
      <Badge variant="info">Streaming</Badge>
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
                'w-full rounded-2xl border border-white/5 bg-slate-900/30 p-4 text-left transition hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-slate-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60'
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={severity.badge}>{severity.label}</Badge>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-3 text-base font-semibold text-white">{activity.action}</p>
              <p className="text-sm text-slate-300">{activity.context}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">{activity.actor}</p>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);


