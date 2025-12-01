'use client';

import clsx from 'clsx';
import {
  ActivitySquare,
  BarChart3,
  LayoutDashboard,
  LucideIcon,
  ShieldCheck,
  Settings,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { IconName, NavItem } from '@/lib/types';

const iconMap: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  insights: BarChart3,
  activity: ActivitySquare,
  connections: Users2,
  reports: BarChart3,
  security: ShieldCheck,
  settings: Settings
};

interface PrimaryNavProps {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

export const PrimaryNav = ({ items, collapsed = false, onNavigate }: PrimaryNavProps) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={clsx('h-full w-full', collapsed && 'items-center')}
      data-collapsed={collapsed}
    >
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={clsx(
                  'focus-ring group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted hover:bg-surface/40'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={clsx(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-primary' : 'text-muted group-hover:text-foreground'
                  )}
                  aria-hidden="true"
                />
                <span className={clsx(collapsed && 'hidden lg:inline')}>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

