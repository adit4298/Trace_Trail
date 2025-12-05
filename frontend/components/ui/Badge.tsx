import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  soft?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-white/10 text-slate-200 border-white/20',
  info: 'bg-cyan-400/15 text-cyan-200 border-cyan-400/30',
  success: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/40',
  warning: 'bg-amber-400/15 text-amber-200 border-amber-400/45',
  critical: 'bg-rose-500/15 text-rose-200 border-rose-500/35'
};

export const Badge = ({ variant = 'neutral', children, className, soft = false }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase',
      soft ? 'backdrop-blur' : '',
      variantStyles[variant],
      className
    )}
  >
    {children}
  </span>
);


