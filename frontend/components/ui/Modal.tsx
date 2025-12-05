'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

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
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={resolvedLabel}
        className={clsx(
          'relative z-10 flex h-full max-h-[95vh] w-full flex-col overflow-hidden border border-white/10 bg-slate-900/85 text-slate-100 shadow-[0_25px_70px_rgba(2,6,23,0.65)] backdrop-blur-2xl',
          variant === 'center' ? 'm-auto max-w-2xl rounded-3xl animate-modal-in' : 'ml-auto w-full max-w-md animate-drawer-in',
          size === 'lg' ? 'max-w-3xl' : 'max-w-xl'
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
          <div>
            {title ? <p className="text-lg font-semibold text-white">{title}</p> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <footer className="border-t border-white/5 bg-white/5 px-6 py-4">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
};


