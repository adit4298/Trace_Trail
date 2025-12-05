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
    label: 'All good',
    description: 'Your digital presence looks calm and protected.',
    gradient: 'from-[#4BC6A9] via-[#5dd6ba] to-[#bcebdc]',
    glow: 'shadow-[0_12px_35px_rgba(75,198,169,0.35)]',
    ringClass: 'border-[#4BC6A9]/70',
    pulseClass: 'animate-health-breathe-slow',
    tooltipTone: 'text-[#4BC6A9]'
  },
  moderate: {
    label: 'Keep an eye',
    description: 'A few items need watching, but nothing urgent.',
    gradient: 'from-[#F4C77C] via-[#F7D59F] to-[#FDF0D3]',
    glow: 'shadow-[0_12px_35px_rgba(244,199,124,0.35)]',
    ringClass: 'border-[#F4C77C]/70',
    pulseClass: 'animate-health-breathe-medium',
    tooltipTone: 'text-[#F5C688]'
  },
  warning: {
    label: 'Caution',
    description: 'We spotted changes worth a gentle review soon.',
    gradient: 'from-[#F1A45F] via-[#F7BE8C] to-[#FFE1C9]',
    glow: 'shadow-[0_12px_35px_rgba(241,164,95,0.35)]',
    ringClass: 'border-[#F1A45F]/70',
    pulseClass: 'animate-health-breathe-fast',
    tooltipTone: 'text-[#F1A45F]'
  },
  critical: {
    label: 'Take a look',
    description: 'A few sensitive items need your quick confirmation.',
    gradient: 'from-[#EB8E8B] via-[#F3A3A1] to-[#FFD9D8]',
    glow: 'shadow-[0_12px_35px_rgba(235,142,139,0.4)]',
    ringClass: 'border-[#EB8E8B]/70',
    pulseClass: 'animate-health-breathe-critical',
    tooltipTone: 'text-[#EB8E8B]'
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


