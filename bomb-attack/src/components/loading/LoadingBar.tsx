'use client';

import { motion } from 'framer-motion';
import styles from './LoadingBar.module.css';

interface LoadingBarProps {
  progress: number;
  showPercent?: boolean;
  color?: string;
  className?: string;
}

export function LoadingBar({ 
  progress, 
  showPercent = true, 
  color = '#4ade80',
  className = '',
}: LoadingBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`${styles.container} ${className}`} role="progressbar" aria-valuenow={clampedProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do carregamento">
      <div 
        className={styles.barBackground}
        style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
      >
        <motion.div
          className={styles.barFill}
          style={{ 
            backgroundColor: color,
            width: `${Math.min(100, Math.max(0, progress))}%`
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showPercent && (
        <motion.span
          className={styles.percentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {Math.round(clampedProgress)}%
        </motion.span>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LoadingSpinner({ size = 40, color = '#4ade80', className = '' }: LoadingSpinnerProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="90 30"
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        >
          <motion.animate
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -120 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </circle>
      </svg>
    </motion.div>
  );
}