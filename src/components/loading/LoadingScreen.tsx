'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, LoadingBar } from './LoadingBar';
import { useLoading, getRandomMessage } from '@/context/LoadingContext';
import { useI18n } from '@/hooks/useI18n';
import styles from './LoadingScreen.module.css';

export function LoadingScreen({
  phase = 'initial',
  customMessage,
  showProgress = true,
}: {
  phase?: 'initial' | 'region' | 'battle' | 'boss' | 'worldmap' | 'workshop' | 'character' | 'settings' | 'about' | 'home';
  customMessage?: string;
  showProgress?: boolean;
}) {
  const { state, progress, message, showPercent } = useLoading();
  const { t } = useI18n();

  if (state === 'idle' || state === 'success') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="status"
        aria-live="polite"
        aria-busy={state === 'loading'}
      >
        <motion.div
          className={styles.container}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-title"
          aria-describedby="loading-message"
        >
          <div className={styles.logoContainer}>
            <svg className={styles.logo} viewBox="0 0 120 120" role="img" aria-label="Astra Artillery Logo">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#4ade80" strokeWidth="4"/>
              <path d="M60 20 L60 55 M45 40 L60 55 L75 40" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="60" cy="60" r="12" fill="#4ade80"/>
              <circle cx="60" cy="60" r="4" fill="#0f172a"/>
            </svg>
          </div>

          <motion.p
            id="loading-title"
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {t('loading.title')}
          </motion.p>

          <motion.p
            id="loading-message"
            className={styles.message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {message || t('loading.preparing')}
          </motion.p>

          {showProgress && (
            <motion.div
              className={styles.progressContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="progress-bar-wrapper" style={{ width: '100%', maxWidth: 320 }}>
                <div className="progress-bar-bg" style={{ backgroundColor: '#1e293b', borderRadius: 9999, height: 8, overflow: 'hidden' }}>
                  <motion.div
                    className="progress-bar-fill"
                    style={{ backgroundColor: '#4ade80', height: '100%', borderRadius: 9999, width: `${Math.min(100, Math.max(0, progress))}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
              {showPercent && (
                <motion.span
                  className="progress-percent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {state === 'error' && (
              <motion.div
                className="error-container"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.2 }}
                role="alert"
                aria-live="assertive"
              >
                <p className="error-message">{t('loading.loadError')}</p>
                <div className="error-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {}}
                  >
                    {t('loading.tryAgain')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {}}
                  >
                    {t('common.back')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function LoadingOverlay({
  isVisible,
  message,
}: {
  isVisible: boolean;
  message?: string;
}) {
  const { t } = useI18n();

  if (!isVisible) return null;

  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="loading-overlay-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingSpinner size={48} />
        <motion.p
          className="loading-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {message || t('common.loading')}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
