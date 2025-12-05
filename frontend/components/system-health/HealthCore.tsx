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
      'relative rounded-full border border-white/10 bg-opacity-70 backdrop-blur-xl',
      gradientClass,
      glowClass,
      pulseClass
    )}
    style={{ width: size, height: size }}
  >
    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),rgba(255,255,255,0))]" />
    <div className="absolute inset-3 rounded-full border border-white/10 blur-xl" />
    <div className="absolute inset-0 animate-orb-pulse rounded-full opacity-40 blur-2xl" />
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </div>
  </div>
);


