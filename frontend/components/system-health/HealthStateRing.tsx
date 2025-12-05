import clsx from 'clsx';

import type { HealthState } from './useHealthStatus';

interface HealthStateRingProps {
  size: number;
  ringClass: string;
  state: HealthState;
}

export const HealthStateRing = ({ size, ringClass, state }: HealthStateRingProps) => (
  <div
    className={clsx(
      'absolute inset-0 flex items-center justify-center rounded-full border-2',
      ringClass,
      state === 'critical' ? 'animate-avatar-ring-critical' : 'animate-avatar-ring'
    )}
    style={{ width: size + 24, height: size + 24, margin: -12 }}
    aria-hidden="true"
  >
    <div className="h-[4px] w-[30%] rounded-full bg-white/40 blur-sm" />
  </div>
);


