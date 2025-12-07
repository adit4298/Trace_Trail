'use client';

import type { CSSProperties } from 'react';

interface OnboardingHighlightProps {
  rect: DOMRect | null;
  visible: boolean;
  padding?: number;
}

export const OnboardingHighlight = ({ rect, visible, padding = 16 }: OnboardingHighlightProps) => {
  if (!visible || !rect) {
    return null;
  }

  const style: CSSProperties = {
    top: Math.max(8, rect.top - padding),
    left: Math.max(8, rect.left - padding),
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    borderRadius: '1.5rem',
    boxShadow: '0 0 0 20000px rgba(4, 6, 14, 0.78)',
    transition: 'all 200ms ease'
  };

  return <div className="pointer-events-none fixed z-[201]" style={style} aria-hidden="true" />;
};


