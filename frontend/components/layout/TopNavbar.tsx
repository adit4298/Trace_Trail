'use client';

import { Bell, Command, Menu, Moon, Search, Sun } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useSidebar } from '@/components/layout/SidebarContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { useTheme } from '@/hooks/useTheme';

import type { UserProfile } from '@/lib/types';

// Helper function to generate user initials (demo fallback)
const getUserInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface TopNavbarProps {
  notifications: number;
  user: UserProfile;
}

// Demo notifications (mock data)
const mockNotifications = [
  { id: '1', text: 'New signal detected (demo)', time: '2m ago' },
  { id: '2', text: 'Weekly report generated (demo)', time: '1h ago' },
  { id: '3', text: 'System health check completed (demo)', time: '3h ago' }
];

export const TopNavbar = ({ notifications, user }: TopNavbarProps) => {
  const { toggleSidebar, isOpen: isSidebarOpen } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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

          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="relative rounded-2xl border border-border/60 bg-surface-muted/80 p-2 text-foreground transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="View notifications"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <Bell className="h-5 w-5" />
              {mockNotifications.length > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-warning/80 text-[10px] font-semibold text-primary-foreground">
                  {mockNotifications.length}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-80 rounded-2xl border border-border/50 bg-surface p-3 text-sm text-foreground shadow-lg z-50"
              >
                <div className="mb-2 pb-2 border-b border-border/40">
                  <p className="font-semibold text-foreground">Notifications (Demo)</p>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded-xl border border-border/40 bg-surface-muted/60 px-3 py-2 text-xs text-foreground"
                    >
                      <p className="font-medium">{notif.text}</p>
                      <p className="text-muted mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border/40 text-center">
                  <p className="text-xs text-muted">Demo mode: Notifications are simulated</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-muted/80 px-2 py-1 pr-3 text-left transition hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-primary/10">
                {user.avatarUrl && !avatarError ? (
                  <Image
                    src={user.avatarUrl}
                    alt={`${user.name} avatar`}
                    fill
                    className="object-cover"
                    sizes="40px"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
                    {getUserInitials(user.name)}
                  </span>
                )}
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
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-primary/60">Demo Workspace</p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-foreground transition hover:bg-surface-muted"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/settings');
                  }}
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-foreground transition hover:bg-surface-muted"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/settings/preferences');
                  }}
                >
                  Preferences
                </button>
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl bg-primary/20 px-3 py-2 text-left font-semibold text-foreground transition hover:bg-primary/30"
                  onClick={() => {
                    setProfileOpen(false);
                    // Sign out logic would go here
                    // TODO: Implement sign out functionality
                  }}
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


