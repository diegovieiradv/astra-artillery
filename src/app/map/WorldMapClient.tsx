'use client';

import { useState, useEffect, useMemo } from 'react';
import { LEVELS, REGIONS, type LevelConfig } from '@/game/data/levels';
import { GameLoader } from '@/components/loading/GameLoader';
import styles from './WorldMapClient.module.css';

interface WorldMapClientProps {
  unlockedLevels: string[];
  completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>;
  currentLevelId: string;
  onStartBattle: (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => void;
}

/** Explicit positions for level markers on the illustrated map (percentages) */
const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  // Green Valley (left side)
  arena_1:  { x: 8,  y: 52 },
  arena_2:  { x: 11, y: 45 },
  arena_3:  { x: 14, y: 55 },
  arena_4:  { x: 17, y: 48 },
  boss_1:   { x: 20, y: 42 },
  // Crystal Desert (center-left)
  arena_5:  { x: 25, y: 50 },
  arena_6:  { x: 28, y: 43 },
  arena_7:  { x: 31, y: 53 },
  arena_8:  { x: 34, y: 46 },
  boss_2:   { x: 37, y: 40 },
  // Frozen Peaks (center)
  arena_9:  { x: 42, y: 48 },
  arena_10: { x: 45, y: 41 },
  arena_11: { x: 48, y: 51 },
  arena_12: { x: 51, y: 44 },
  boss_3:   { x: 54, y: 38 },
  // Ember Lands (center-right)
  arena_13: { x: 59, y: 50 },
  arena_14: { x: 62, y: 43 },
  arena_15: { x: 65, y: 53 },
  arena_16: { x: 68, y: 46 },
  boss_4:   { x: 71, y: 40 },
  // Sky Kingdom (upper right)
  arena_17: { x: 76, y: 38 },
  arena_18: { x: 79, y: 32 },
  arena_19: { x: 82, y: 42 },
  arena_20: { x: 85, y: 35 },
  boss_5:   { x: 88, y: 29 },
  // Dark Citadel (far right)
  arena_21: { x: 90, y: 48 },
  arena_22: { x: 92, y: 42 },
  arena_23: { x: 94, y: 52 },
  arena_24: { x: 96, y: 45 },
  boss_6:   { x: 98, y: 38 },
};

function computeMarkerPositions(): { x: number; y: number }[] {
  return LEVELS.map(level => {
    const pos = MAP_POSITIONS[level.arenaId];
    return pos || { x: 50, y: 50 };
  });
}

export default function WorldMapClient({
  unlockedLevels,
  completedLevels,
  currentLevelId,
  onStartBattle,
}: WorldMapClientProps) {
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const markerPositions = useMemo(() => computeMarkerPositions(), []);

  // Preload the map image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/images/maps/mapa.png';
  }, []);

  const isLevelUnlocked = (level: LevelConfig): boolean => {
    if (!level.unlockRequirement) return true;
    const reqLevel = LEVELS.find(l => l.id === level.unlockRequirement);
    if (!reqLevel) return true;
    return unlockedLevels.includes(reqLevel.arenaId) ||
           completedLevels[reqLevel.arenaId] !== undefined;
  };

  const isLevelCompleted = (level: LevelConfig): boolean => {
    return completedLevels[level.arenaId] !== undefined;
  };

  const getStars = (level: LevelConfig): number => {
    return completedLevels[level.arenaId]?.stars ?? 0;
  };

  const handleMarkerClick = (level: LevelConfig) => {
    if (!isLevelUnlocked(level)) return;
    setSelectedLevel(level);
  };

  const handleStart = () => {
    if (!selectedLevel) return;
    onStartBattle({
      levelId: selectedLevel.arenaId,
      levelNumber: selectedLevel.id,
      difficulty: selectedLevel.difficulty,
      cpuCharacterId: selectedLevel.cpuCharacterId,
    });
  };

  const handleClosePopup = () => {
    setSelectedLevel(null);
  };

  if (!imageLoaded) {
    return (
      <div className={styles.loaderContainer}>
        <GameLoader message="Carregando mapa..." showProgress={false} />
      </div>
    );
  }

  return (
    <div className={styles.worldMap}>
      {/* Map background */}
      <img
        src="/images/maps/mapa.png"
        alt="Mapa do mundo"
        className={styles.mapImage}
        draggable={false}
      />

      {/* Floating clouds */}
      <img src="/images/maps/effects/nuvem-01.png" alt="" className={`${styles.cloud} ${styles.cloud1}`} draggable={false} />
      <img src="/images/maps/effects/nuvem-02.png" alt="" className={`${styles.cloud} ${styles.cloud2}`} draggable={false} />
      <img src="/images/maps/effects/nuvem-03.png" alt="" className={`${styles.cloud} ${styles.cloud3}`} draggable={false} />

      {/* Level markers */}
      <div className={styles.markersLayer}>
        {LEVELS.map((level, index) => {
          const pos = markerPositions[index];
          const unlocked = isLevelUnlocked(level);
          const completed = isLevelCompleted(level);
          const stars = getStars(level);
          const isSelected = selectedLevel?.id === level.id;
          const isHovered = hoveredLevel === level.id;

          return (
            <button
              key={level.id}
              className={`${styles.marker} ${unlocked ? styles.markerUnlocked : styles.markerLocked} ${completed ? styles.markerCompleted : ''} ${isSelected ? styles.markerSelected : ''} ${level.isBoss ? styles.markerBoss : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => handleMarkerClick(level)}
              onMouseEnter={() => setHoveredLevel(level.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              disabled={!unlocked}
              aria-label={`Nível ${level.id}: ${level.name}`}
              title={!unlocked ? 'Bloqueado' : level.name}
            >
              <img
                src="/images/maps/effects/ponto-do-mapa.png"
                alt=""
                className={styles.markerImage}
                draggable={false}
              />
              {level.isBoss && (
                <span className={styles.bossIcon}>★</span>
              )}
              {/* Tooltip on hover */}
              {(isHovered || isSelected) && unlocked && (
                <div className={styles.tooltip}>
                  <span className={styles.tooltipName}>{level.name}</span>
                  <span className={styles.tooltipDifficulty}>
                    {level.difficulty === 'easy' ? 'Fácil' : level.difficulty === 'normal' ? 'Normal' : 'Difícil'}
                  </span>
                  {completed && stars > 0 && (
                    <span className={styles.tooltipStars}>
                      {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Level popup */}
      {selectedLevel && (
        <div className={styles.popup} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={handleClosePopup} aria-label="Fechar">
              ✕
            </button>
            <h3 className={styles.popupTitle}>{selectedLevel.name}</h3>
            <div className={styles.popupInfo}>
              <span className={styles.popupRegion}>
                {REGIONS[selectedLevel.regionId]?.name || selectedLevel.regionId}
              </span>
              <span className={`${styles.popupDifficulty} ${styles[`diff_${selectedLevel.difficulty}`]}`}>
                {selectedLevel.difficulty === 'easy' ? 'Fácil' : selectedLevel.difficulty === 'normal' ? 'Normal' : 'Difícil'}
              </span>
            </div>
            {isLevelCompleted(selectedLevel) && (
              <div className={styles.popupStars}>
                {'★'.repeat(getStars(selectedLevel))}{'☆'.repeat(3 - getStars(selectedLevel))}
              </div>
            )}
            <p className={styles.popupObjective}>
              {selectedLevel.isBoss ? 'Batalha contra o Boss!' : 'Derrote o inimigo!'}
            </p>
            <button className={styles.popupStartBtn} onClick={handleStart}>
              {selectedLevel.isBoss ? 'ENFRENTAR BOSS' : 'INICIAR BATALHA'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
