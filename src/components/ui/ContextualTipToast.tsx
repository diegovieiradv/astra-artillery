'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getContextualTip,
  dismissContextualTip,
  type ContextualTip,
} from '@/game/data/tips';
import styles from './ContextualTipToast.module.css';

interface Props {
  context: {
    missStreak?: number;
    hpPercent?: number;
    isFirstBattle?: boolean;
    hasNewWeapon?: boolean;
    windSpeed?: number;
    battleTurns?: number;
  };
  onDismiss?: () => void;
}

export function ContextualTipToast({ context, onDismiss }: Props) {
  const [tip, setTip] = useState<ContextualTip | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const found = getContextualTip(context);
    if (found) {
      setTip(found);
      setVisible(true);
    }
  }, [context.missStreak, context.hpPercent, context.isFirstBattle, context.windSpeed, context.battleTurns]);

  const handleDismiss = () => {
    if (tip) {
      dismissContextualTip(tip.id);
    }
    setVisible(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {visible && tip && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          role="alert"
        >
          <span className={styles.icon}>{tip.icon}</span>
          <div className={styles.content}>
            <span className={styles.title}>{tip.title}</span>
            <span className={styles.message}>{tip.message}</span>
          </div>
          <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Fechar dica">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
