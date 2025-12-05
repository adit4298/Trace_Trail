'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { HealthModal, type HealthBreakdown } from './HealthModal';
import { HealthCore } from './HealthCore';
import { HealthStateRing } from './HealthStateRing';
import { HealthTooltip } from './HealthTooltip';
import { useHealthStatus } from './useHealthStatus';

type AvatarPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

const positionClasses: Record<AvatarPosition, string> = {
  'bottom-left': 'left-6 bottom-6',
  'bottom-right': 'right-6 bottom-6',
  'top-left': 'left-6 top-6',
  'top-right': 'right-6 top-6'
};

interface SystemHealthAvatarProps {
  score: number;
  position?: AvatarPosition;
  size?: number;
  updatedAt: Date;
  breakdown: HealthBreakdown;
  onOpenDetails?: () => void;
}

export const SystemHealthAvatar = ({
  score,
  position = 'bottom-left',
  size = 80,
  updatedAt,
  breakdown,
  onOpenDetails
}: SystemHealthAvatarProps) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const status = useHealthStatus(score);

  const openModal = () => {
    setOpen(true);
    onOpenDetails?.();
  };

  return (
    <>
      <div
        className={clsx(
          'pointer-events-none fixed z-40 transition-transform duration-300',
          positionClasses[position]
        )}
      >
        <button
          type="button"
          className={clsx(
            'relative pointer-events-auto flex flex-col items-center gap-2 rounded-3xl border border-white/5 bg-slate-900/30 p-3 text-xs text-white shadow-[0_30px_80px_rgba(3,7,18,0.65)] backdrop-blur-2xl transition hover:-translate-y-1.5',
            status.glow
          )}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onClick={openModal}
          aria-label="System health status"
        >
          <div className="relative">
            <HealthStateRing size={size} ringClass={status.ringClass} state={status.state} />
            <HealthCore
              size={size}
              gradientClass={`bg-gradient-to-br ${status.gradient}`}
              glowClass={status.glow}
              pulseClass={status.pulseClass}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              {Math.round(score)}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-slate-300">{status.label}</span>
          <HealthTooltip
            visible={hovered}
            label={status.label}
            score={score}
            description={status.description}
            updatedAt={updatedAt}
            toneClass={status.tooltipTone}
            onOpenDetails={openModal}
          />
        </button>
      </div>

      <HealthModal
        open={open}
        onClose={() => setOpen(false)}
        score={score}
        label={status.label}
        state={status.state}
        breakdown={breakdown}
      />
    </>
  );
};


