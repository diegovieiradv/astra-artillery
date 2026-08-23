'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function ReduceMotionProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useGameStore((state) => state.settings.reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return <>{children}</>;
}