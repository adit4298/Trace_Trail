'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { Onboarding } from '@/components/onboarding/Onboarding';
import { onboardingSteps } from '@/components/onboarding/onboardingSteps';

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

  const toggleNav = useCallback(() => setIsNavOpen((prev) => !prev), []);
  const closeNav = useCallback(() => setIsNavOpen(false), []);

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isNavOpen, closeNav]);

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
          <TopNavbar notifications={notifications} user={user} onToggleSidebar={toggleNav} />

          <main
            id="main-content"
            role="main"
            className="flex flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-12"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">{children}</div>
          </main>
        </div>
      </div>

      <div
        className={clsx(
          'fixed inset-0 z-40 transition-opacity duration-300',
          isNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        data-state={isNavOpen ? 'open' : 'closed'}
        aria-hidden={!isNavOpen}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <button
          type="button"
          className="absolute inset-0 z-0 h-full w-full cursor-pointer bg-transparent"
          aria-label="Close navigation overlay"
          onClick={closeNav}
        />
        <div
          className={clsx(
            'relative z-10 flex h-full w-72 -translate-x-full flex-col bg-[#14181f] shadow-2xl transition-transform duration-300 ease-out',
            isNavOpen && 'translate-x-0'
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <div className="flex items-center justify-between px-4 py-4 text-sm">
            <p className="font-semibold uppercase tracking-[0.3em] text-muted">Navigate</p>
            <button
              type="button"
              className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase text-muted transition hover:text-foreground"
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

      <Onboarding steps={onboardingSteps} />
    </div>
  );
};

