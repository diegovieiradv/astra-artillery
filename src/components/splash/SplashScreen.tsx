'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SplashScreen.module.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const HEROES = [
  { id: 'kai', name: 'Kai', color: '#4ade80', delay: 0.2 },
  { id: 'luna', name: 'Luna', color: '#60a5fa', delay: 0.4 },
  { id: 'bolt', name: 'Bolt', color: '#facc15', delay: 0.6 },
];

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'ready' | 'exiting'>('enter');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['#4ade80', '#60a5fa', '#facc15', '#f97316', '#ef4444', '#a78bfa'];
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 60 + Math.random() * 40,
      delay: Math.random() * 3,
      size: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(p);

    const timer = setTimeout(() => setPhase('ready'), 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('exiting');
    setTimeout(onComplete, 500);
  }, [phase, onComplete]);

  // Test mode: auto-dismiss after ready when ?test=true URL parameter is present
  // Runs during render for immediate effect, not in useEffect
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const isTestMode = params.get('test') === 'true';
    if (isTestMode && phase === 'ready') {
      setTimeout(handleStart, 100);
    }
  }

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
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          role="button"
          tabIndex={0}
          aria-label="Tap to start"
        >
          {/* Sky background layers */}
          <div className={styles.sky} />
          <div className={styles.clouds}>
            <div className={`${styles.cloud} ${styles.cloud1}`} />
            <div className={`${styles.cloud} ${styles.cloud2}`} />
            <div className={`${styles.cloud} ${styles.cloud3}`} />
          </div>
          <div className={styles.terrain} />

          {/* Floating particles */}
          <div className={styles.particleField}>
            {particles.map((p) => (
              <div
                key={p.id}
                className={styles.particle}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Characters */}
          <div className={styles.heroes}>
            {HEROES.map((hero, i) => (
              <motion.div
                key={hero.id}
                className={styles.hero}
                initial={{ y: 80, opacity: 0, scale: 0.7 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: hero.delay, duration: 0.6, ease: 'easeOut' }}
              >
                <div className={styles.heroAvatar} style={{ borderColor: hero.color }}>
                  <img
                    src={`/characters/avatar_${hero.id}.svg`}
                    alt={hero.name}
                    className={styles.heroImg}
                  />
                </div>
                <div className={styles.heroName} style={{ color: hero.color }}>{hero.name}</div>
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <div className={styles.content}>
            <motion.div
              className={styles.titleWrap}
              initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <h1 className={styles.title}>ASTRA</h1>
              <h1 className={styles.titleAccent}>ARTILLERY</h1>
            </motion.div>

            <motion.p
              className={styles.subtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Artilharia em Turnos
            </motion.p>

            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div
                  className={styles.startBtn}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={styles.startText}>CLIQUE PARA JOGAR</span>
                  <span className={styles.startTextMobile}>TOQUE PARA JOGAR</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* VS splash decoration */}
          <div className={styles.vsBadge}>
            <span>VS</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
