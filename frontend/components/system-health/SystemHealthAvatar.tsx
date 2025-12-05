'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { HealthCore } from './HealthCore';
import { HealthModal, type HealthBreakdown } from './HealthModal';
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
        className={clsx('pointer-events-none fixed z-40 transition-transform duration-300', positionClasses[position])}
      >
        <button
          type="button"
          className={clsx(
            'pointer-events-auto relative flex flex-col items-center gap-2 rounded-[24px] border border-border/60 bg-surface p-3 text-xs text-foreground shadow-[0_18px_45px_rgba(10,12,15,0.35)] transition hover:-translate-y-1',
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
            <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {Math.round(score)}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted">{status.label}</span>
          <span className="text-[10px] text-muted">Tap for details</span>
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


