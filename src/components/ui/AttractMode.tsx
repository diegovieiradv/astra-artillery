'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCharacters } from '@/game/characters/registry';
import styles from './AttractMode.module.css';

const IDLE_TIMEOUT = 30000;
const DEMO_INTERVAL = 4000;

export function AttractMode() {
  const [active, setActive] = useState(false);
  const [demoChar, setDemoChar] = useState(0);
  const [mounted, setMounted] = useState(false);
  const characters = getAllCharacters();

  const resetTimer = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    let idleTimer: ReturnType<typeof setTimeout>;
    let demoTimer: ReturnType<typeof setInterval>;

    const startIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setActive(true);
        demoTimer = setInterval(() => {
          setDemoChar(prev => (prev + 1) % characters.length);
        }, DEMO_INTERVAL);
      }, IDLE_TIMEOUT);
    };

    const handleActivity = () => {
      resetTimer();
      clearInterval(demoTimer);
      startIdleTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);
    startIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      clearInterval(demoTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [characters.length, resetTimer]);

  if (!mounted) return null;

  const char = characters[demoChar];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={resetTimer}
        >
          <div className={styles.content}>
            <motion.div
              className={styles.charDisplay}
              key={char.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={`/characters/avatar_${char.id}.svg`}
                alt={char.name}
                className={styles.avatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <h2 className={styles.charName}>{char.name}</h2>
              <p className={styles.charRole}>{char.role}</p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>HP</span>
                  <div className={styles.statBar}>
                    <div className={styles.statFill} style={{ width: `${char.stats.health}%` }} />
                  </div>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>ATK</span>
                  <div className={styles.statBar}>
                    <div className={styles.statFillAtk} style={{ width: `${char.stats.attack * 100}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className={styles.cta}>
              <span className={styles.ctaText}>CLIQUE PARA JOGAR</span>
              <span className={styles.ctaSub}>ASTRA ARTILLERY</span>
            </div>
          </div>

          <div className={styles.particles}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
