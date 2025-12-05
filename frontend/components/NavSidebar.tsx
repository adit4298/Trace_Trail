'use client';

import clsx from 'clsx';
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  Radar,
  ScanSearch,
  Settings,
  Share2,
  Shield,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

import type { IconName, NavItem } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: Partial<Record<IconName, LucideIcon>> = {
  overview: Gauge,
  dashboard: LayoutDashboard,
  signals: Radar,
  investigations: ScanSearch,
  insights: Sparkles,
  activity: Activity,
  accounts: Share2,
  connections: Share2,
  reports: BarChart3,
  security: Shield,
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
  const primaryIds = new Set<IconName>(['overview', 'signals', 'investigations', 'activity', 'reports']);
  const primary = items.filter((item) => primaryIds.has(item.icon));
  const secondary = items.filter((item) => !primaryIds.has(item.icon));

  return (
    <aside
      className={clsx(
        'relative z-20 flex-col border-r border-border/40 bg-[#14181f] transition-all duration-300',
        variant === 'default' ? 'hidden lg:flex' : 'flex',
        collapsed ? 'w-[4.75rem]' : 'w-64'
      )}
      aria-label="Primary navigation"
    >
      <div className="flex flex-1 flex-col gap-6 px-3 py-6">
        <div className={clsx('flex items-center gap-3 px-2', collapsed && 'justify-center')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Fingerprint className="h-5 w-5" />
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-foreground">TraceTrail</p>
              <p className="text-xs text-muted">Security Center</p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 space-y-6">
          {[{ label: 'Protection', items: primary }, { label: 'Workspace', items: secondary }].map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.label} className="space-y-2">
                  {!collapsed ? (
                    <p className="px-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted/70">
                      {section.label}
                    </p>
                  ) : null}
                  <ul className="space-y-1.5">
                    {section.items.map((item) => {
                      const Icon = iconMap[item.icon] ?? Gauge;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(`${item.href}/`));

                      const content = (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={onNavigate}
                          className={clsx(
                            'group/nav relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                            isActive
                              ? 'bg-surface text-foreground shadow-sm'
                              : 'text-muted hover:bg-surface-muted/60 hover:text-foreground'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span
                            className={clsx(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/60 text-primary transition-transform group-hover/nav:scale-[1.04]',
                              isActive && 'border-primary/60 bg-primary/10 text-primary'
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>

                          {!collapsed ? (
                            <span className="flex flex-1 items-center justify-between">
                              <span className="flex flex-col">
                                <span>{item.label}</span>
                                <span className="text-xs text-muted">
                                  {isActive ? 'Active' : 'View insights'}
                                </span>
                              </span>
                              {item.badge ? (
                                <Badge variant="info" soft className="text-[10px] uppercase tracking-wide">
                                  {item.badge}
                                </Badge>
                              ) : null}
                            </span>
                          ) : null}

                          {isActive ? (
                            <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                          ) : null}
                        </Link>
                      );

                      return (
                        <li key={item.id}>
                          {collapsed ? (
                            <Tooltip content={item.label} side="right">
                              {content}
                            </Tooltip>
                          ) : (
                            content
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
          )}
        </nav>
      </div>

      {variant === 'default' ? (
        <div className="border-t border-border/40 px-3 py-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-surface-muted/60 py-2 text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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

