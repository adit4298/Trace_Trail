import { ReactNode } from "react";
import { clsx } from "clsx";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendVariant?: "up" | "down" | "neutral";
  icon?: ReactNode;
  helper?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  trendVariant = "neutral",
  icon,
  helper
}: MetricCardProps) {
  const trendColor =
    trendVariant === "up"
      ? "text-emerald-400 bg-emerald-400/10"
      : trendVariant === "down"
        ? "text-rose-400 bg-rose-400/10"
        : "text-white/70 bg-white/5";

  return (
    <div className="glass-panel flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">{title}</div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/80">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-white">{value}</span>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", trendColor)}>
          {trend}
        </span>
      </div>
      {helper && <p className="text-xs text-white/50">{helper}</p>}
    </div>
  );
}

