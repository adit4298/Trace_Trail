'use client';

import clsx from 'clsx';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState, type ReactNode } from 'react';

import { useTheme } from '@/hooks/useTheme';
import type { NavItem, UserProfile } from '@/lib/types';

import { PrimaryNav } from './PrimaryNav';

interface AppShellProps {
  navItems: NavItem[];
  notifications: number;
  user: UserProfile;
  children: ReactNode;
}

export const AppShell = ({ navItems, notifications, user, children }: AppShellProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeNav = useCallback(() => setIsNavOpen(false), []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="relative hidden w-64 flex-shrink-0 border-r border-border/70 bg-surface lg:flex">
        <div className="flex h-full w-full flex-col gap-8 px-5 py-6">
          <div className="px-1">
            <p className="text-xs uppercase tracking-widest text-muted">TraceTrail</p>
            <p className="text-lg font-semibold text-foreground">Intelligence Cloud</p>
          </div>
          <PrimaryNav items={navItems} />
        </div>
      </aside>

      {isNavOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border/60 bg-surface p-6 shadow-soft">
            <button
              type="button"
              className="focus-ring mb-6 flex items-center gap-3 rounded-xl bg-background px-4 py-2 text-sm font-medium text-muted"
              onClick={closeNav}
            >
              Close
            </button>
            <PrimaryNav items={navItems} onNavigate={closeNav} />
          </div>
        </div>
      ) : null}

      <div className="flex w-full flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-surface/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
            <button
              type="button"
              className="focus-ring lg:hidden"
              aria-label="Open navigation menu"
              onClick={() => setIsNavOpen(true)}
            >
              <Menu className="h-6 w-6 text-muted" aria-hidden="true" />
            </button>
            <form className="relative flex-1" role="search" aria-label="Global search">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <label htmlFor="global-search" className="sr-only">
                Search signals, cases, people
              </label>
              <input
                id="global-search"
                name="q"
                type="search"
                placeholder="Search signals, cases, or people"
                className="w-full rounded-full border border-border/60 bg-background/70 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                autoComplete="off"
              />
            </form>

            <button
              type="button"
              className="focus-ring rounded-full border border-border/70 bg-background/80 p-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-muted" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4 text-muted" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              className="focus-ring relative rounded-full border border-border/70 bg-background/80 p-2"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4 text-muted" aria-hidden="true" />
              {notifications > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger text-xs font-semibold text-white">
                  {notifications}
                </span>
              ) : null}
            </button>

            <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 lg:flex">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-primary/15">
                <Image
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  fill
                  sizes="36px"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted">{user.title}</p>
              </div>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          role="main"
          className="flex flex-1 flex-col gap-8 bg-background px-4 py-8 sm:px-6 lg:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

