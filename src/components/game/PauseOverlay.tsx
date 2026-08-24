'use client';

import { useEffect, useCallback } from 'react';
import { useI18n } from '@/hooks/useI18n';
import styles from './PauseOverlay.module.css';

interface PauseOverlayProps {
  isPaused: boolean;
  onResume: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ isPaused, onResume, onQuit }: PauseOverlayProps) {
  const { t } = useI18n();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      onResume();
    }
  }, [onResume]);

  useEffect(() => {
    if (isPaused) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPaused, handleKeyDown]);

  if (!isPaused) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-label={t('battle.pauseTitle')} aria-modal="true">
      <div className={styles.card}>
        <div className={styles.pauseIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </div>
        <h2 className={styles.title}>{t('battle.pauseTitle')}</h2>
        <p className={styles.hint}>{t('battle.pauseHint')}</p>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onResume}
            autoFocus
          >
            {t('battle.resume')}
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={onQuit}
          >
            {t('battle.quitBattle')}
          </button>
        </div>
      </div>
    </div>
  );
}
