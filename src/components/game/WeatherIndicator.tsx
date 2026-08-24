'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherType, getWeatherConfig } from '@/game/data/weather';
import styles from './WeatherIndicator.module.css';

interface WeatherIndicatorProps {
  weather?: WeatherType;
  wind?: number;
}

export function WeatherIndicator({ weather = 'clear', wind = 0 }: WeatherIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const config = getWeatherConfig(weather);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const windDir = wind >= 0 ? '→' : '←';
  const windAbs = Math.abs(wind).toFixed(1);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ borderColor: config.color }}
      >
        <div className={styles.weatherInfo}>
          <span className={styles.icon}>{config.icon}</span>
          <div className={styles.details}>
            <span className={styles.name}>{config.name}</span>
            <span className={styles.desc}>{config.description}</span>
          </div>
        </div>

        <div className={styles.windInfo}>
          <span className={styles.windLabel}>VENTO</span>
          <span className={styles.windValue} style={{ color: config.color }}>
            {windDir} {windAbs}
          </span>
        </div>

        {config.windModifier !== 1.0 && (
          <div className={styles.modifier}>
            <span className={styles.modLabel}>Vento x{config.windModifier}</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
