'use client';

import { useState, useEffect, useMemo } from 'react';
import { LEVELS, REGIONS, REGION_ORDER, type LevelConfig } from '@/game/data/levels';
import { GameLoader } from '@/components/loading/GameLoader';
import styles from './WorldMapClient.module.css';

interface WorldMapClientProps {
  unlockedLevels: string[];
  completedLevels: Record<string, { stars: number; bestTurns: number; bestDamage: number }>;
  currentLevelId: string;
  onStartBattle: (data: { levelId: string; levelNumber: number; difficulty: string; cpuCharacterId: string }) => void;
}

/** Positions for level markers on the illustrated map (percentages) */
function computeMarkerPositions(): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const total = LEVELS.length;

  // Distribute markers along a winding path across the map
  // Green Valley (1-5): left side, middle height
  // Crystal Desert (6-10): center-left
  // Frozen Peaks (11-15): center
  // Ember Lands (16-20): center-right
  // Sky Kingdom (21-25): upper right
  // Dark Citadel (26-30): far right, slightly lower

  const regionRanges: Record<string, { xStart: number; xEnd: number; yCenter: number; yVariance: number }> = {
    green_valley:   { xStart: 8,  xEnd: 22, yCenter: 55, yVariance: 10 },
    crystal_desert: { xStart: 24, xEnd: 38, yCenter: 50, yVariance: 12 },
    frozen_peaks:   { xStart: 40, xEnd: 54, yCenter: 45, yVariance: 10 },
    ember_lands:    { xStart: 56, xEnd: 70, yCenter: 55, yVariance: 10 },
    sky_kingdom:    { xStart: 72, xEnd: 86, yCenter: 35, yVariance: 8 },
    dark_citadel:   { xStart: 88, xEnd: 97, yCenter: 50, yVariance: 10 },
  };

  LEVELS.forEach((level) => {
    const range = regionRanges[level.regionId] || regionRanges.green_valley;
    const levelsInRegion = LEVELS.filter(l => l.regionId === level.regionId);
    const indexInRegion = levelsInRegion.indexOf(level);
    const countInRegion = levelsInRegion.length;

    const x = range.xStart + ((range.xEnd - range.xStart) * indexInRegion) / Math.max(countInRegion - 1, 1);
    // Add some wave pattern for Y
    const wave = Math.sin(indexInRegion * 0.8 + REGION_ORDER.indexOf(level.regionId as any) * 1.2) * range.yVariance;
    const y = range.yCenter + wave;

    positions.push({ x, y });
  });

  return positions;
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

      {/* Region indicators */}
      <div className={styles.regionIndicators}>
        {REGION_ORDER.map((regionId) => {
          const region = REGIONS[regionId];
          const levelsInRegion = LEVELS.filter(l => l.regionId === regionId);
          const completedInRegion = levelsInRegion.filter(l => isLevelCompleted(l)).length;
          const totalInRegion = levelsInRegion.length;

          return (
            <div key={regionId} className={styles.regionBadge} style={{ borderColor: region.color }}>
              <span className={styles.regionName} style={{ color: region.color }}>{region.name}</span>
              <span className={styles.regionProgress}>{completedInRegion}/{totalInRegion}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
