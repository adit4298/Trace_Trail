'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { OnboardingHighlight } from './OnboardingHighlight';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetId?: string;
}

interface OnboardingProps {
  steps: OnboardingStep[];
  storageKey?: string;
  onDismiss?: () => void;
}

const DEFAULT_STORAGE_KEY = 'tracetrail_onboarding_complete';

export const Onboarding = ({ steps, storageKey = DEFAULT_STORAGE_KEY, onDismiss }: OnboardingProps) => {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [animating, setAnimating] = useState(false);

  const currentStep = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const completed = window.localStorage.getItem(storageKey);
    if (!completed) {
      setIsActive(true);
    }
  }, [mounted, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !currentStep) {
      return;
    }

    const onboardingEvent = new CustomEvent('tracetrail:onboarding-step', {
      detail: { stepId: currentStep.id }
    });
    window.dispatchEvent(onboardingEvent);
  }, [currentStep]);

  useEffect(() => {
    const targetId = currentStep?.targetId;
    if (!isActive || !targetId) {
      setSpotlightRect(null);
      return;
    }

    const updateRect = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setSpotlightRect(null);
        return;
      }
      setSpotlightRect(target.getBoundingClientRect());
    };

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
      requestAnimationFrame(updateRect);
    };

    scrollToTarget();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep?.targetId, isActive]);

  const completeTutorial = () => {
    window.localStorage.setItem(storageKey, 'true');
    setIsActive(false);
    onDismiss?.();
  };

  const goNext = () => {
    if (isLastStep) {
      completeTutorial();
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const skipTutorial = () => completeTutorial();

  const progress = useMemo(() => ((currentIndex + 1) / steps.length) * 100, [currentIndex, steps.length]);

  const hasTarget = Boolean(currentStep?.targetId && spotlightRect);
  const modalPosition = useMemo(() => {
    if (!hasTarget || !spotlightRect) {
      return { isAbsolute: false, top: undefined, left: undefined };
    }

    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const modalWidth = Math.min(768, viewportWidth - 32);
    const modalHeight = 280;
    const spacing = 24;

    const targetCenterX = spotlightRect.left + spotlightRect.width / 2;
    const targetCenterY = spotlightRect.top + spotlightRect.height / 2;
    const targetBottom = spotlightRect.bottom;
    const targetTop = spotlightRect.top;

    let top: number | undefined;
    let left: number | undefined;

    if (targetBottom + spacing + modalHeight < viewportHeight) {
      top = targetBottom + spacing;
      left = Math.max(16, Math.min(targetCenterX - modalWidth / 2, viewportWidth - modalWidth - 16));
    } else if (targetTop - spacing - modalHeight > 0) {
      top = targetTop - spacing - modalHeight;
      left = Math.max(16, Math.min(targetCenterX - modalWidth / 2, viewportWidth - modalWidth - 16));
    } else {
      top = Math.max(16, Math.min(targetCenterY - modalHeight / 2, viewportHeight - modalHeight - 16));
      if (targetCenterX + modalWidth / 2 + spacing < viewportWidth) {
        left = targetCenterX + spotlightRect.width / 2 + spacing;
      } else {
        left = spotlightRect.left - modalWidth - spacing;
      }
      left = Math.max(16, Math.min(left, viewportWidth - modalWidth - 16));
    }

    return { isAbsolute: true, top, left };
  }, [hasTarget, spotlightRect]);

  useEffect(() => {
    if (!isActive) return;
    setAnimating(true);
    const timer = window.setTimeout(() => setAnimating(false), 220);
    return () => window.clearTimeout(timer);
  }, [currentIndex, isActive]);

  if (!mounted || !isActive || steps.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      {hasTarget ? null : (
        <div className="fixed inset-0 bg-[#05070d]/70 backdrop-blur-[2px] transition-opacity duration-300" />
      )}
      <div className="fixed inset-0 z-[199]" aria-hidden="true" />

      <OnboardingHighlight rect={spotlightRect} visible={hasTarget} />

      <div
        className={clsx(
          'pointer-events-none z-[205] flex px-4',
          hasTarget && modalPosition.isAbsolute
            ? 'absolute'
            : 'fixed inset-x-0 bottom-0 justify-center pb-6'
        )}
        style={
          hasTarget && modalPosition.isAbsolute && modalPosition.top !== undefined && modalPosition.left !== undefined
            ? { top: `${modalPosition.top}px`, left: `${modalPosition.left}px` }
            : undefined
        }
      >
        <div
          key={currentStep.id}
          className={clsx(
            'pointer-events-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[#111523]/95 p-6 shadow-[0_20px_80px_rgba(5,7,13,0.7)] transition-all duration-300 ease-out',
            animating ? 'translate-y-5 opacity-0' : 'translate-y-0 opacity-100'
          )}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">Guide</p>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted">
                {currentIndex + 1} / {steps.length}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white">{currentStep.title}</h2>
          <p className="mt-2 text-base text-muted">{currentStep.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={clsx(
                'rounded-2xl border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                currentIndex === 0 && 'opacity-40'
              )}
              onClick={goBack}
              disabled={currentIndex === 0}
            >
              Back
            </button>

            <button
              type="button"
              className="rounded-2xl border border-transparent bg-gradient-to-r from-primary to-indigo-500 px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={goNext}
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>

            <button
              type="button"
              className="ml-auto text-sm font-semibold text-muted underline-offset-4 transition hover:text-white"
              onClick={skipTutorial}
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


