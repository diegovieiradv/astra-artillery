'use client';

import { useState, useEffect, useCallback } from 'react';
import { getI18n, Locale } from '@/i18n';

export function useI18n() {
  const [i18n] = useState(() => getI18n());
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale());

  useEffect(() => {
    const unsub = i18n.onChange((newLocale) => {
      setLocaleState(newLocale);
    });
    return unsub;
  }, [i18n]);

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.setLocale(newLocale);
  }, [i18n]);

  const t = useCallback((key: string): string => {
    return i18n.t(key);
  }, [i18n, locale]);

  return { t, locale, setLocale, getLocaleName: i18n.getLocaleName.bind(i18n), getAvailableLocales: i18n.getAvailableLocales.bind(i18n) };
}
