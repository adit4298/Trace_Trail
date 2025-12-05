/* eslint-disable tailwindcss/classnames-order */
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
  <>
    {/* eslint-disable-next-line tailwindcss/classnames-order */}
    <div
      className={clsx(
        /* eslint-disable-next-line tailwindcss/classnames-order */
        'absolute bottom-full left-1/2 pointer-events-none mb-4 w-64 rounded-2xl border border-border/60 bg-surface p-4 text-sm text-foreground shadow-lg transition-all duration-200 -translate-x-1/2',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
    >
      <p className={clsx('text-xs uppercase tracking-[0.3em]', toneClass)}>{label}</p>
      <p className="text-2xl font-semibold text-foreground">
        {score.toFixed(1)}
        <span className="text-sm text-muted"> / 100</span>
      </p>
      <p className="text-xs text-muted">Updated {formatRelative(updatedAt)}</p>
      <p className="mt-2 text-xs text-muted">{description}</p>
      <button
        type="button"
        className="pointer-events-auto mt-3 rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-muted"
        onClick={onOpenDetails}
      >
        View system health
      </button>
    </div>
  </>
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

/* eslint-enable tailwindcss/classnames-order */
