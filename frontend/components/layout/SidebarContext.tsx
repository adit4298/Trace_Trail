'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface SidebarContextValue {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const previousOverflow = useRef<string>();
  const previousPadding = useRef<string>();

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const body = document.body;
      previousOverflow.current = body.style.overflow;
      previousPadding.current = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        body.style.overflow = previousOverflow.current ?? '';
        body.style.paddingRight = previousPadding.current ?? '';
      };
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidebar]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnboardingStep = (event: Event) => {
      const detail = (event as CustomEvent<{ stepId?: string }>).detail;
      if (!detail?.stepId) return;

      if (detail.stepId === 'navigation') {
        openSidebar();
      }

      if (detail.stepId === 'welcome' || detail.stepId === 'menu' || detail.stepId === 'complete') {
        closeSidebar();
      }
    };

    window.addEventListener('tracetrail:onboarding-step', handleOnboardingStep as EventListener);
    return () => window.removeEventListener('tracetrail:onboarding-step', handleOnboardingStep as EventListener);
  }, [openSidebar, closeSidebar]);

  return (
    <SidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};


