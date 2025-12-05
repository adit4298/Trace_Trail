'use client';

import { Bell, Command, Menu, Moon, Search, Sun } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Tooltip } from '@/components/ui/Tooltip';
import { useTheme } from '@/hooks/useTheme';
import type { UserProfile } from '@/lib/types';

interface TopNavbarProps {
  notifications: number;
  user: UserProfile;
  onOpenSidebar: () => void;
}

export const TopNavbar = ({ notifications, user, onOpenSidebar }: TopNavbarProps) => {
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
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-900/60 backdrop-blur-2xl">
      <div className="flex items-center gap-4 px-4 py-4 lg:px-8">
        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-col leading-tight text-white lg:flex">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">TraceTrail</span>
          <span className="text-lg font-semibold">TraceTrail Intelligence Cloud</span>
        </div>

        <form className="relative flex-1" role="search" aria-label="Global search">
          <label htmlFor="global-search" className="sr-only">
            Search signals, cases, anomalies
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="global-search"
            type="search"
            placeholder="Search signals, cases, anomalies…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-24 text-sm text-white placeholder:text-slate-400 transition focus:border-cyan-400/60 focus:bg-slate-900/40 focus:outline-none"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <Tooltip content="Toggle dark / light theme">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </Tooltip>

          <Tooltip content="Notifications">
            <button
              type="button"
              className="relative rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-[10px] font-semibold">
                  {notifications}
                </span>
              ) : null}
            </button>
          </Tooltip>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2 py-1 pr-3 text-left transition hover:shadow-[0_15px_35px_rgba(8,145,178,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
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
              <span className="hidden flex-col text-sm text-white sm:flex">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-slate-400">{user.title}</span>
              </span>
            </button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-900/95 p-3 text-sm text-slate-200 shadow-[0_25px_70px_rgba(3,7,18,0.65)] backdrop-blur-2xl"
              >
                <div className="mb-3 rounded-2xl border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.title}</p>
                  <p className="text-xs text-slate-500">{user.organization}</p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-slate-200 transition hover:bg-white/5"
                >
                  View profile
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-slate-200 transition hover:bg-white/5"
                >
                  Preferences
                </button>
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-400/20 to-indigo-500/20 px-3 py-2 text-left font-semibold text-white transition hover:from-cyan-400/30 hover:to-indigo-500/30"
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


