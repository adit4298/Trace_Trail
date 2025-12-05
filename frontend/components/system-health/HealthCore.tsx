import clsx from 'clsx';

interface HealthCoreProps {
  size: number;
  gradientClass: string;
  glowClass: string;
  pulseClass: string;
}

export const HealthCore = ({ size, gradientClass, glowClass, pulseClass }: HealthCoreProps) => (
  <div
    className={clsx(
      'relative rounded-full border border-white/15 bg-gradient-to-br',
      gradientClass,
      glowClass,
      pulseClass
    )}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-1 rounded-full border border-white/20 opacity-70" />
    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
    <div className="absolute inset-0 animate-orb-pulse rounded-full opacity-30" />
    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
  </div>
);


