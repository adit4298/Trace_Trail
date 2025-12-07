'use client';

import { Bell, Command, Menu, Moon, Search, Sun } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useSidebar } from '@/components/layout/SidebarContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTheme } from '@/hooks/useTheme';

import type { UserProfile } from '@/lib/types';

interface TopNavbarProps {
  notifications: number;
  user: UserProfile;
}

export const TopNavbar = ({ notifications, user }: TopNavbarProps) => {
  const { toggleSidebar, isOpen: isSidebarOpen } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-surface/95 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-4 lg:px-8">
        <button
          type="button"
          id="onboarding-hamburger"
          className="rounded-2xl border border-border/60 bg-surface-muted/80 p-2 text-foreground transition-transform duration-150 hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95"
          aria-label="Toggle navigation menu"
          aria-expanded={isSidebarOpen}
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-col leading-tight text-foreground lg:flex">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">TraceTrail</span>
          <span className="text-lg font-semibold">Security Companion</span>
          <span className="text-xs text-muted">Friendly insights for your digital life</span>
        </div>

        <form className="relative flex-1" role="search" aria-label="Global search">
          <label htmlFor="global-search" className="sr-only">
            Search signals, cases, anomalies
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="global-search"
            type="search"
            placeholder="Search signals, cases, anomalies…"
            className="w-full rounded-full border border-border/60 bg-surface-muted/80 py-3 pl-12 pr-24 text-sm text-foreground placeholder:text-muted focus:border-primary/50 focus:outline-none"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-border/60 bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Tooltip content="Toggle dark / light theme">
            <button
              type="button"
              className="rounded-2xl border border-border/60 bg-surface-muted/80 p-2 text-foreground transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </Tooltip>

          <Tooltip content="Notifications">
            <button
              type="button"
              className="relative rounded-2xl border border-border/60 bg-surface-muted/80 p-2 text-foreground transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-warning/80 text-[10px] font-semibold text-primary-foreground">
                  {notifications}
                </span>
              ) : null}
            </button>
          </Tooltip>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-muted/80 px-2 py-1 pr-3 text-left transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={user.avatarUrl}
                  alt={`${user.name} avatar`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </span>
              <span className="hidden flex-col text-sm text-foreground sm:flex">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted">{user.title}</span>
              </span>
            </button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-2xl border border-border/50 bg-surface p-3 text-sm text-foreground shadow-lg"
              >
                <div className="mb-3 rounded-2xl border border-border/40 bg-surface-muted/60 p-3">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted">{user.title}</p>
                  <p className="text-xs text-muted">{user.organization}</p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-foreground transition hover:bg-surface-muted"
                >
                  View profile
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-foreground transition hover:bg-surface-muted"
                >
                  Preferences
                </button>
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl bg-primary/20 px-3 py-2 text-left font-semibold text-foreground transition hover:bg-primary/30"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};


