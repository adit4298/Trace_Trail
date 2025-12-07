'use client';

import { type ReactNode } from 'react';

import { Onboarding } from '@/components/onboarding/Onboarding';
import { onboardingSteps } from '@/components/onboarding/onboardingSteps';

import { AnimatedBackground } from './layout/AnimatedBackground';
import { SidebarDrawer } from './layout/SidebarDrawer';
import { SidebarProvider } from './layout/SidebarContext';
import { TopNavbar } from './layout/TopNavbar';

import type { NavItem, UserProfile } from '@/lib/types';

interface AppShellProps {
  navItems: NavItem[];
  notifications: number;
  user: UserProfile;
  children: ReactNode;
}

export const AppShell = ({ navItems, notifications, user, children }: AppShellProps) => (
  <SidebarProvider>
    <ShellSurface navItems={navItems} notifications={notifications} user={user}>
      {children}
    </ShellSurface>
  </SidebarProvider>
);

const ShellSurface = ({ navItems, notifications, user, children }: AppShellProps) => (
  <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
    <AnimatedBackground />

    <div className="relative z-10 flex min-h-screen">
      <div className="flex flex-1 flex-col bg-background/95">
        <TopNavbar notifications={notifications} user={user} />

        <main
          id="main-content"
          role="main"
          className="flex flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-12"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>

    <SidebarDrawer items={navItems} />
    <Onboarding steps={onboardingSteps} />
  </div>
);

