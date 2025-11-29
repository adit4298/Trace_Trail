interface TrendCardProps {
  title: string;
  description: string;
  points: number[];
}

export function TrendCard({ title, description, points }: TrendCardProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return (
    <div className="glass-panel relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-gradient-to-br from-brand.purple/30 via-transparent to-brand.blue/30 opacity-60" />
      <div className="relative space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">{title}</p>
          <p className="mt-1 text-base text-white/90">{description}</p>
        </div>
        <svg className="h-32 w-full" viewBox="0 0 320 128" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendStroke" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop stopColor="#7B61FF" offset="0%" />
              <stop stopColor="#38BDF8" offset="100%" />
            </linearGradient>
            <linearGradient id="trendFill" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop stopColor="rgba(123,97,255,0.35)" offset="0%" />
              <stop stopColor="rgba(56,189,248,0)" offset="100%" />
            </linearGradient>
          </defs>
          <path
            d={buildPath(points, range, min)}
            fill="url(#trendFill)"
            stroke="none"
            opacity={0.55}
          />
          <path
            d={buildLine(points, range, min)}
            fill="none"
            stroke="url(#trendStroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function buildLine(points: number[], range: number, min: number) {
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 320;
      const y = 128 - ((point - min) / range) * 128;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildPath(points: number[], range: number, min: number) {
  return (
    buildLine(points, range, min) +
    ` L 320 128 L 0 128 Z`
  );
}

