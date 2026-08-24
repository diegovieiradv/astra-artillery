'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function AccessibilityEnforcer({ children }: { children: React.ReactNode }) {
  const { settings } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <>{children}</>;

  const classes: string[] = [];
  if (settings.highContrast) classes.push('a11y-high-contrast');
  if (settings.largeText) classes.push('a11y-large-text');
  if (settings.reduceMotion) classes.push('a11y-reduce-motion');

  return (
    <>
      <style jsx global>{`
        .a11y-high-contrast {
          filter: contrast(1.3);
        }
        .a11y-large-text {
          font-size: 120% !important;
        }
        .a11y-large-text h1, .a11y-large-text h2, .a11y-large-text h3 {
          font-size: 130% !important;
        }
        .a11y-reduce-motion *, .a11y-reduce-motion *::before, .a11y-reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `}</style>
      <div className={classes.join(' ') || undefined}>
        {children}
      </div>
    </>
  );
}
