'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OrientationHandler.module.css';

type Orientation = 'portrait' | 'landscape';

export function OrientationHandler() {
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [showWarning, setShowWarning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile && orientation === 'portrait') {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [orientation, mounted]);

  const handleDismiss = () => {
    setShowWarning(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.card}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={styles.title}>Gire o dispositivo</h2>
            <p className={styles.message}>
              Para a melhor experiencia, use o modo paisagem (horizontal).
            </p>
            <button className={styles.btn} onClick={handleDismiss}>
              Continuar assim mesmo
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
