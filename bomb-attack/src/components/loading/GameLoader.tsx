'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading, getRandomMessage } from '@/context/LoadingContext';
import { LoadingSpinner } from './LoadingBar';
import styles from './GameLoader.module.css';

interface GameLoaderProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
  phase?: 'initial' | 'region' | 'battle' | 'boss' | 'worldmap' | 'workshop' | 'character' | 'settings' | 'about' | 'home';
}

const messages = [
  'Preparando arena...',
  'Carregando aventureiros...',
  'Calculando o vento...',
  'Ajustando miras...',
  'Quase lá...',
];

export function GameLoader({ 
  message = 'Carregando...', 
  progress, 
  showProgress = true,
  className = '',
  phase = 'initial',
}: GameLoaderProps) {
  const { state, progress: contextProgress, message: contextMessage, showPercent } = useLoading();
  const [currentMessage, setCurrentMessage] = useState(message);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!showProgress) return;
    
    const interval = setInterval(() => {
      if (msgIndex < messages.length - 1) {
        setMsgIndex((i) => i + 1);
        setCurrentMessage(messages[msgIndex + 1]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [msgIndex, showProgress]);

  const displayMessage = currentMessage || getRandomMessage('initial');
  const displayProgress = progress ?? 0;
  const displayPercent = showPercent && showProgress;

  return (
    <div className={`${styles.loader} ${className}`} role="status" aria-live="polite">
      <motion.div 
        className={styles.logoContainer}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className={styles.logo} viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#4ade80" strokeWidth="4"/>
          <path d="M60 20 L60 55 M45 40 L60 55 L75 40" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="60" r="12" fill="#4ade80"/>
          <circle cx="60" cy="60" r="4" fill="#0f172a"/>
        </svg>
      </motion.div>
      
      <motion.p 
        className={styles.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {currentMessage}
      </motion.p>
      
      {showProgress && (
        <motion.div 
          className={styles.progressContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className={styles.progressBarWrapper}>
            <motion.div 
              className={styles.progressBar}
              role="progressbar"
              aria-valuenow={progress ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(progress ?? 0, 0), 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          {displayPercent && (
            <motion.span 
              className={styles.progressText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {Math.round(displayProgress)}%
            </motion.span>
          )}
        </motion.div>
      )}
    </div>
  );
}

export function FullScreenLoader({ message = 'Iniciando jogo...' }: { message?: string }) {
  return (
    <motion.div 
      className={styles.fullScreen} 
      role="status" 
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <GameLoader message={message} showProgress={false} />
    </motion.div>
  );
}

export function LoadingOverlay({ isVisible, message = 'Carregando...' }: { isVisible: boolean; message?: string }) {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div 
        className={styles.loadingContent}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <GameLoader message={message} showProgress={false} />
      </motion.div>
    </motion.div>
  );
}