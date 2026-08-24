'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'ready' | 'exiting'>('logo');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 4,
    }));
    setParticles(p);

    const timer = setTimeout(() => setPhase('ready'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('exiting');
    setTimeout(onComplete, 600);
  }, [phase, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleStart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleStart]);

  return (
    <AnimatePresence>
      {phase !== 'exiting' && (
        <motion.div
          className={styles.splash}
          onClick={handleStart}
          onTouchEnd={(e) => { e.preventDefault(); handleStart(); }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          role="button"
          tabIndex={0}
          aria-label="Tap to start"
        >
          <div className={styles.starfield}>
            {particles.map((p) => (
              <div
                key={p.id}
                className={styles.star}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          <div className={styles.content}>
            <motion.div
              className={styles.logoWrap}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <svg className={styles.logo} viewBox="0 0 200 200" aria-hidden="true">
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#glow)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#ringGrad)" strokeWidth="3" opacity="0.6" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="#4ade80" strokeWidth="2" opacity="0.3" />
                <path d="M100 30 L100 85 M75 60 L100 85 L125 60" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="100" r="18" fill="#4ade80" />
                <circle cx="100" cy="100" r="6" fill="#0f172a" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="8 12" opacity="0.4">
                  <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="100" r="65" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3">
                  <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="15s" repeatCount="indefinite" />
                </circle>
              </svg>
            </motion.div>

            <motion.h1
              className={styles.title}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              ASTRA ARTILLERY
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Artilharia em Turnos
            </motion.p>

            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div
                  className={styles.startPrompt}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={styles.tapText}>
                    CLIQUE PARA COMEÇAR
                  </span>
                  <span className={styles.tapTextMobile}>
                    TOQUE PARA COMEÇAR
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`${styles.cornerDeco} ${styles['top-left']}`} />
          <div className={`${styles.cornerDeco} ${styles['top-right']}`} />
          <div className={`${styles.cornerDeco} ${styles['bottom-left']}`} />
          <div className={`${styles.cornerDeco} ${styles['bottom-right']}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
