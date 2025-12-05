'use client';

import clsx from 'clsx';
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Gauge,
  LayoutDashboard,
  LucideIcon,
  Radar,
  ScanSearch,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import type { IconName, NavItem } from '@/lib/types';

const iconMap: Partial<Record<IconName, LucideIcon>> = {
  overview: Gauge,
  dashboard: LayoutDashboard,
  signals: Radar,
  investigations: ScanSearch,
  insights: Sparkles,
  activity: Activity,
  connections: Share2,
  reports: BarChart3,
  security: ShieldCheck,
  settings: Settings
};

interface NavSidebarProps {
  items: NavItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  variant?: 'default' | 'overlay';
}

export const NavSidebar = ({
  items,
  collapsed,
  onToggleCollapse,
  onNavigate,
  variant = 'default'
}: NavSidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'group/sidebar relative z-20 flex-col border-r border-white/5 bg-slate-900/40 backdrop-blur-2xl transition-all duration-300',
        variant === 'default' ? 'hidden lg:flex' : 'flex',
        collapsed ? 'w-20' : 'w-64'
      )}
      aria-label="Primary navigation"
    >
      <div className="flex flex-1 flex-col gap-6 px-4 py-6">
        <nav>
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = iconMap[item.icon] ?? Gauge;
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));

              const linkContent = (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    'group/nav relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70',
                    'ring-1 ring-white/5 backdrop-blur',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent text-white shadow-[0_10px_30px_rgba(6,182,212,0.25)]'
                      : 'text-slate-300 hover:text-white hover:shadow-[0_20px_45px_rgba(6,182,212,0.15)] hover:ring-cyan-400/40'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={clsx(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/5 text-cyan-300 transition-all duration-200',
                      'shadow-[inset_0_0_15px_rgba(94,234,212,0.25)] group-hover/nav:bg-cyan-400/20',
                      collapsed && 'mx-auto'
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  {!collapsed ? (
                    <span className="flex flex-1 items-center justify-between">
                      <span className="ml-1 flex flex-col">
                        <span className="text-base">{item.label}</span>
                        <span className="text-xs text-slate-400 transition group-hover/nav:text-slate-200">
                          {isActive ? 'Currently viewing' : 'Jump to panel'}
                        </span>
                      </span>
                      {item.badge ? (
                        <Badge variant="info" soft className="text-[10px] uppercase tracking-widest">
                          {item.badge}
                        </Badge>
                      ) : null}
                    </span>
                  ) : null}
                </Link>
              );

              return (
                <li key={item.id}>
                  {collapsed ? (
                    <Tooltip content={item.label} side="right" align="center">
                      {linkContent}
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {variant === 'default' ? (
        <div className="border-t border-white/5 px-4 py-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        </div>
      ) : null}
    </aside>
  );
};

