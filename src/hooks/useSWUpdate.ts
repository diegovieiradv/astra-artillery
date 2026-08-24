'use client';

import { useEffect, useState, useCallback } from 'react';

interface SWState {
  registration: ServiceWorkerRegistration | null;
  isUpdateAvailable: boolean;
  isInstalling: boolean;
  isUpdated: boolean;
}

export function useSWUpdate(): SWState & { applyUpdate: () => void } {
  const [state, setState] = useState<SWState>({
    registration: null,
    isUpdateAvailable: false,
    isInstalling: false,
    isUpdated: false,
  });

  const applyUpdate = useCallback(() => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [state.registration]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    function onUpdateFound() {
      if (!registration) return;
      const newWorker = registration.installing;
      if (!newWorker) return;

      setState((s) => ({ ...s, isInstalling: true }));

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setState((s) => ({
            ...s,
            isUpdateAvailable: true,
            isInstalling: false,
          }));
        }
      });
    }

    navigator.serviceWorker.ready.then((reg) => {
      registration = reg;
      setState((s) => ({ ...s, registration: reg }));

      reg.addEventListener('updatefound', onUpdateFound);

      if (reg.waiting && navigator.serviceWorker.controller) {
        setState((s) => ({ ...s, isUpdateAvailable: true }));
      }
    });

    let refreshing = false;
    function onControllerChange() {
      if (!refreshing) {
        refreshing = true;
        setState((s) => ({ ...s, isUpdated: true, isUpdateAvailable: false }));
      }
    }

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      if (registration) {
        registration.removeEventListener('updatefound', onUpdateFound);
      }
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return { ...state, applyUpdate };
}
