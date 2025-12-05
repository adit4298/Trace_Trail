import clsx from 'clsx';
import type { ReactNode } from 'react';

interface MainPanelProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const MainPanel = ({ title, subtitle, actions, children, className }: MainPanelProps) => (
  <section
    className={clsx(
      'relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 text-white shadow-[0_30px_80px_rgba(3,7,18,0.65)] backdrop-blur-3xl transition hover:border-cyan-300/25 hover:bg-white/10',
      'before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:opacity-0 before:transition before:duration-300 hover:before:opacity-100',
      className
    )}
  >
    {(title || subtitle || actions) && (
      <header className="mb-6 flex flex-wrap items-baseline gap-3">
        <div className="flex-1">
          {title ? <p className="text-lg font-semibold text-white">{title}</p> : null}
          {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
    )}
    {children}
  </section>
);


