'use client';

import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';

import type { ReactNode } from 'react';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  side?: TooltipSide;
  align?: TooltipAlign;
  className?: string;
}

const getPositionClasses = (side: TooltipSide, align: TooltipAlign) => {
  const base = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-3',
    right: 'left-full ml-3'
  }[side];

  const alignment = (() => {
    if (side === 'top' || side === 'bottom') {
      if (align === 'start') return 'left-0';
      if (align === 'end') return 'right-0';
      return 'left-1/2 -translate-x-1/2';
    }
    if (align === 'start') return 'top-0';
    if (align === 'end') return 'bottom-0';
    return 'top-1/2 -translate-y-1/2';
  })();

  return `${base} absolute ${alignment}`;
};

export const Tooltip = ({
  content,
  children,
  delay = 100,
  side = 'top',
  align = 'center',
  className
}: TooltipProps) => {
  const tooltipId = useId();
  const timeoutRef = useRef<number>();
  const [visible, setVisible] = useState(false);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    window.clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      className={clsx('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={tooltipId} className="contents">
        {children}
      </span>
      <span
        role="tooltip"
        id={tooltipId}
        className={clsx(
          'pointer-events-none whitespace-nowrap rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-150',
          'translate-y-1 opacity-0 will-change-transform data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100',
          getPositionClasses(side, align)
        )}
        data-visible={visible}
      >
        {content}
      </span>
    </span>
  );
};


