/* eslint-disable tailwindcss/classnames-order */
'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import type { ReactNode } from 'react';

type ModalVariant = 'center' | 'right';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: ModalVariant;
  size?: 'md' | 'lg';
  ariaLabel?: string;
}

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  variant = 'center',
  size = 'md',
  ariaLabel
}: ModalProps) => {
  const resolvedLabel = ariaLabel ?? title ?? 'Dialog';

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        aria-label="Close dialog overlay"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* eslint-disable-next-line tailwindcss/classnames-order */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={resolvedLabel}
        className={clsx(
          /* eslint-disable-next-line tailwindcss/classnames-order */
          'relative z-10 flex flex-col h-full w-full max-h-[95vh] overflow-hidden border border-border/60 bg-surface text-foreground shadow-[0_25px_60px_rgba(4,6,9,0.45)]',
          variant === 'center'
            ? 'm-auto max-w-2xl rounded-[28px] animate-modal-in'
            : 'ml-auto w-full max-w-md rounded-l-[28px] animate-drawer-in',
          size === 'lg' ? 'max-w-3xl' : 'max-w-xl'
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div>
            {title ? <p className="text-lg font-semibold text-foreground">{title}</p> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border/60 bg-surface-muted/70 p-2 text-muted transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <footer className="border-t border-border/60 bg-surface-muted/60 px-6 py-4">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
};

/* eslint-enable tailwindcss/classnames-order */
