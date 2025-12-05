'use client';

import { useCallback, useState, type ReactNode } from 'react';

import type { NavItem, UserProfile } from '@/lib/types';

import { AnimatedBackground } from './layout/AnimatedBackground';
import { NavSidebar } from './NavSidebar';
import { TopNavbar } from './layout/TopNavbar';

interface AppShellProps {
  navItems: NavItem[];
  notifications: number;
  user: UserProfile;
  children: ReactNode;
}

export const AppShell = ({ navItems, notifications, user, children }: AppShellProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const closeNav = useCallback(() => setIsNavOpen(false), []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen">
        <NavSidebar
          items={navItems}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <div className="flex flex-1 flex-col">
          <TopNavbar notifications={notifications} user={user} onOpenSidebar={() => setIsNavOpen(true)} />

          <main
            id="main-content"
            role="main"
            className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10"
          >
            {children}
          </main>
        </div>
      </div>

      {isNavOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <div className="absolute inset-y-0 left-0 flex h-full w-72 flex-col bg-slate-950/90">
            <div className="flex items-center justify-between px-4 py-4 text-sm">
              <p className="font-semibold uppercase tracking-[0.3em] text-slate-300">Navigate</p>
              <button
                type="button"
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase text-slate-300"
                onClick={closeNav}
              >
                Close
              </button>
            </div>
            <NavSidebar
              items={navItems}
              collapsed={false}
              onToggleCollapse={() => undefined}
              onNavigate={closeNav}
              variant="overlay"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

