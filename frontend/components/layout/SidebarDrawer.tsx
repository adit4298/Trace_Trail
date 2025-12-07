'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';

import { useSidebar } from '@/components/layout/SidebarContext';
import { NavSidebar } from '@/components/NavSidebar';

import type { NavItem } from '@/lib/types';

interface SidebarDrawerProps {
  items: NavItem[];
}

export const SidebarDrawer = ({ items }: SidebarDrawerProps) => {
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      <button
        type="button"
        className={clsx(
          'pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-200',
          isOpen && 'pointer-events-auto opacity-100'
        )}
        aria-hidden={!isOpen}
        onClick={closeSidebar}
        aria-label="Close sidebar overlay"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-200" />
      </button>

      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 h-full w-[min(90vw,360px)] translate-x-[-16px] scale-[0.96] overflow-y-auto rounded-r-3xl border border-white/5 bg-[#0b111f]/95 px-5 py-6 text-foreground shadow-[0_24px_80px_rgba(3,5,12,0.8)] transition-transform duration-200 will-change-transform',
          isOpen
            ? 'pointer-events-auto translate-x-0 scale-100 opacity-100 ease-out'
            : 'pointer-events-none -translate-x-full opacity-0 ease-in'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation drawer"
        data-state={isOpen ? 'open' : 'closed'}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted/70">Workspace</p>
            <p className="text-lg font-semibold text-white">TraceTrail</p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-muted transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <NavSidebar items={items} variant="drawer" onNavigate={closeSidebar} />
      </aside>
    </>
  );
};


