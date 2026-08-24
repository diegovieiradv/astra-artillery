'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading, getRandomMessage } from '@/context/LoadingContext';

export function NavigationLoader() {
  const pathname = usePathname();
  const { startLoading, updateProgress, completeLoading, state } = useLoading();
  const prevPathname = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (state === 'loading') return;

    const phase = getPhaseFromPath(pathname);
    startLoading(phase, { showPercent: true });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 90) {
        progress = 90;
        clearInterval(interval);
      }
      updateProgress(progress, getRandomMessage(phase));
    }, 120);

    timeoutRef.current = setTimeout(() => {
      clearInterval(interval);
      completeLoading(true);
    }, 600);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return null;
}

function getPhaseFromPath(pathname: string): 'home' | 'battle' | 'workshop' | 'settings' | 'character' | 'worldmap' | 'about' | 'initial' {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/game')) return 'battle';
  if (pathname.startsWith('/workshop')) return 'workshop';
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname.startsWith('/characters')) return 'character';
  if (pathname.startsWith('/map') || pathname.startsWith('/story')) return 'worldmap';
  if (pathname.startsWith('/about')) return 'about';
  return 'initial';
}
