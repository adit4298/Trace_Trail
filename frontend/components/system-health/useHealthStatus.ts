import { useMemo } from 'react';

export type HealthState = 'healthy' | 'moderate' | 'warning' | 'critical';

export interface HealthStatusConfig {
  state: HealthState;
  label: string;
  description: string;
  gradient: string;
  glow: string;
  ringClass: string;
  pulseClass: string;
  tooltipTone: string;
}

const HEALTH_CONFIG: Record<HealthState, Omit<HealthStatusConfig, 'state'>> = {
  healthy: {
    label: 'Healthy',
    description: 'Systems stable. No immediate action required.',
    gradient: 'from-cyan-300 via-cyan-400 to-emerald-300',
    glow: 'shadow-[0_0_35px_rgba(34,211,238,0.55)]',
    ringClass: 'border-cyan-300/70',
    pulseClass: 'animate-health-breathe-slow',
    tooltipTone: 'text-cyan-200'
  },
  moderate: {
    label: 'Moderate',
    description: 'Monitoring new anomalies. Stay alert.',
    gradient: 'from-amber-200 via-amber-300 to-amber-400',
    glow: 'shadow-[0_0_35px_rgba(251,191,36,0.45)]',
    ringClass: 'border-amber-300/70',
    pulseClass: 'animate-health-breathe-medium',
    tooltipTone: 'text-amber-200'
  },
  warning: {
    label: 'Warning',
    description: 'Escalations pending. Review open investigations.',
    gradient: 'from-orange-300 via-orange-400 to-rose-400',
    glow: 'shadow-[0_0_35px_rgba(251,146,60,0.55)]',
    ringClass: 'border-orange-300/70',
    pulseClass: 'animate-health-breathe-fast',
    tooltipTone: 'text-orange-200'
  },
  critical: {
    label: 'Critical',
    description: 'High-risk posture. Immediate action needed.',
    gradient: 'from-rose-400 via-rose-500 to-red-500',
    glow: 'shadow-[0_0_35px_rgba(248,113,113,0.7)]',
    ringClass: 'border-rose-400/70',
    pulseClass: 'animate-health-breathe-critical',
    tooltipTone: 'text-rose-200'
  }
};

export const useHealthStatus = (score: number): HealthStatusConfig =>
  useMemo(() => {
    const state: HealthState =
      score <= 20 ? 'healthy' : score <= 40 ? 'moderate' : score <= 70 ? 'warning' : 'critical';

    return {
      state,
      ...HEALTH_CONFIG[state]
    };
  }, [score]);


