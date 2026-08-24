'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PhotoMode.module.css';

export function PhotoMode() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (active) {
      const hudElements = document.querySelectorAll('[data-hud], nav, [role="navigation"]');
      hudElements.forEach(el => {
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.pointerEvents = 'none';
      });
      return () => {
        hudElements.forEach(el => {
          (el as HTMLElement).style.opacity = '';
          (el as HTMLElement).style.pointerEvents = '';
        });
      };
    }
  }, [active, mounted]);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            className={styles.indicator}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className={styles.cameraIcon}>📸</span>
            <span>FOTO MODE</span>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className={`${styles.toggleBtn} ${active ? styles.toggleActive : ''}`}
        onClick={() => setActive(!active)}
        aria-label={active ? 'Desativar modo foto' : 'Ativar modo foto'}
        title="Modo foto (Ctrl+Shift+P)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
}
