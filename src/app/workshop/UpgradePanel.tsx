'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UPGRADE_CATEGORIES } from './constants';

interface UpgradePanelProps {
  category: 'cannon' | 'armor' | 'mobility' | 'special';
  currentLevel: number;
  nextCost: number;
  currentStats: Record<string, number>;
  onUpgrade: (type: 'cannon' | 'armor' | 'mobility' | 'special') => void;
  maxLevel: number;
}

export function UpgradePanel({ 
  category, 
  currentLevel, 
  nextCost, 
  currentStats, 
  onUpgrade,
  maxLevel = 10,
}: UpgradePanelProps) {
  const catInfo = UPGRADE_CATEGORIES.find(c => c.id === category)!;
  const isMax = currentLevel >= maxLevel;

  return (
    <div className="upgradePanel">
      <div className="upgradeHeader">
        <div className="levelDisplay">
          <motion.span className="currentLevel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            NÍVEL {currentLevel} / {maxLevel}
          </motion.span>
          <motion.div 
            className="progressBar"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: currentLevel / maxLevel }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <motion.div 
              className="progressFill"
              style={{ backgroundColor: catInfo.color }}
            />
          </motion.div>
        </div>
        <motion.div 
          className="nextCost"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isMax ? (
            <span className="maxLevel">MÁXIMO</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{nextCost.toLocaleString()}</span>
            </>
          )}
        </motion.div>
      </div>

      <div className="statsGrid">
        {Object.entries(currentStats).map(([key, value]) => (
          <motion.div 
            key={key}
            className="statCard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="statLabel">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span className="statValue" style={{ color: catInfo.color }}>
              +{value.toFixed(value < 1 ? 2 : 1)}
            </span>
          </motion.div>
        ))}
      </div>

      <button
        className={`upgradeBtn ${isMax ? 'disabled' : ''}`}
        onClick={() => !isMax && onUpgrade(category)}
        disabled={isMax}
        aria-disabled={isMax}
      >
        {isMax ? 'NÍVEL MÁXIMO ATINGIDO' : 'MELHORAR'}
      </button>

      <div className="description">
        <p>{catInfo.description}</p>
      </div>
    </div>
  );
}
