interface ConnectionCardProps {
  platform: string;
  status: "healthy" | "syncing" | "attention";
  lastSync: string;
  risk: number;
}

const statusStyles = {
  healthy: "text-emerald-300 bg-emerald-300/10",
  syncing: "text-sky-300 bg-sky-300/10",
  attention: "text-amber-300 bg-amber-300/10"
};

export function ConnectionCard({ platform, status, lastSync, risk }: ConnectionCardProps) {
  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70">{platform}</p>
          <p className="text-xs text-white/40">Last sync • {lastSync}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs capitalize ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-white/50">Risk score</p>
          <p className="text-3xl font-semibold text-white">{risk}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/5"
        >
          View plan
        </button>
      </div>
    </div>
  );
}

