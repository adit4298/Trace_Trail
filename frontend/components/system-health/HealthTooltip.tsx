import clsx from 'clsx';

interface HealthTooltipProps {
  visible: boolean;
  label: string;
  score: number;
  description: string;
  updatedAt: Date;
  toneClass: string;
  onOpenDetails: () => void;
}

export const HealthTooltip = ({
  visible,
  label,
  score,
  description,
  updatedAt,
  toneClass,
  onOpenDetails
}: HealthTooltipProps) => (
  <div
    className={clsx(
      'pointer-events-none absolute bottom-full left-1/2 mb-4 w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/90 p-4 text-sm text-white shadow-[0_20px_60px_rgba(3,7,18,0.8)] backdrop-blur-2xl transition-all duration-200',
      visible ? 'opacity-100 translate-y-0' : 'translate-y-2 opacity-0'
    )}
  >
    <p className={clsx('text-xs uppercase tracking-[0.3em]', toneClass)}>{label}</p>
    <p className="text-2xl font-semibold text-white">
      {score.toFixed(1)}
      <span className="text-sm text-slate-400"> / 100</span>
    </p>
    <p className="text-xs text-slate-400">Updated {formatRelative(updatedAt)}</p>
    <p className="mt-2 text-xs text-slate-200">{description}</p>
    <button
      type="button"
      className="pointer-events-auto mt-3 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
      onClick={onOpenDetails}
    >
      View system health
    </button>
  </div>
);

const formatRelative = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
};


