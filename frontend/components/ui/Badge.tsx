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
  neutral: 'bg-surface-muted/80 text-muted border-border/50',
  info: 'bg-primary/15 text-primary border-primary/30',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  critical: 'bg-danger/15 text-danger border-danger/30'
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


