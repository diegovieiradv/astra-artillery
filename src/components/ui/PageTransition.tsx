'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

export function PageTransition({ 
  children, 
  transitionType = 'fade',
  duration = 0.3 
}: PageTransitionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ minHeight: '100vh' }}>{children}</div>;
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
  };

  const transition = { duration, ease: 'easeOut' as const };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionType}
        initial={variants[transitionType].initial}
        animate={variants[transitionType].animate}
        exit={variants[transitionType].exit}
        transition={transition}
        className={styles.container}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function LayoutTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={typeof window !== 'undefined' ? window.location.pathname : '/'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}