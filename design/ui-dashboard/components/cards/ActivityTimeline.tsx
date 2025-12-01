interface Activity {
  title: string;
  time: string;
  status: "positive" | "neutral" | "negative";
  description: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Activity</p>
          <h3 className="text-lg font-semibold text-white">Live telemetry</h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          {activities.length} events
        </span>
      </div>
      <ol className="mt-5 space-y-4">
        {activities.map((activity, idx) => (
          <li key={`${activity.title}-${idx}`} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor:
                    activity.status === "positive"
                      ? "#22c55e"
                      : activity.status === "negative"
                        ? "#ef4444"
                        : "#818cf8"
                }}
              />
              {idx !== activities.length - 1 && (
                <span className="mt-1 h-full w-px bg-white/10" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-white/80">
                <p className="font-medium">{activity.title}</p>
                <span className="text-xs text-white/50">{activity.time}</span>
              </div>
              <p className="text-xs text-white/60">{activity.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

