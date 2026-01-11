'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;
  start?: number;
  easing?: (t: number) => number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useCountUp = (
  target: number,
  { duration = 1400, start = 0, easing = easeOutCubic }: UseCountUpOptions = {}
) => {
  /**
   * IMPORTANT:
   * - Server render MUST match first client render
   * - So we start at the FINAL value (target)
   * - Animation only runs after hydration
   */
  const [value, setValue] = useState<number>(target);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // Prevent animation during SSR + first hydration pass
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setValue(target);
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);
      const nextValue = start + (target - start) * eased;

      setValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, start, easing]);

  return value;
};
