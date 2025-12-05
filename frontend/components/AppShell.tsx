'use client';

import { useCallback, useState, type ReactNode } from 'react';

import { AnimatedBackground } from './layout/AnimatedBackground';
import { TopNavbar } from './layout/TopNavbar';
import { NavSidebar } from './NavSidebar';

import type { NavItem, UserProfile } from '@/lib/types';

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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen">
        <NavSidebar
          items={navItems}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <div className="flex flex-1 flex-col bg-background/95">
          <TopNavbar notifications={notifications} user={user} onOpenSidebar={() => setIsNavOpen(true)} />

          <main
            id="main-content"
            role="main"
            className="flex flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-12"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">{children}</div>
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
          <div className="absolute inset-y-0 left-0 flex h-full w-72 flex-col bg-[#14181f]">
            <div className="flex items-center justify-between px-4 py-4 text-sm">
              <p className="font-semibold uppercase tracking-[0.3em] text-muted">Navigate</p>
              <button
                type="button"
                className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase text-muted"
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

