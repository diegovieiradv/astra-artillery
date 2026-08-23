'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getAllCharacters } from '@/game/characters/registry';
import { getAllAchievements, getUnlockedAchievements, getTotalAchievementPoints } from '@/game/data/achievements';
import { getPlayerLevelConfig, getXpProgress } from '@/game/data/playerLevels';
import { MAX_MASTERY_LEVEL, getMasteryLevelConfig, getMasteryXpProgress } from '@/game/data/characterMastery';
import { getLevelsByRegion, REGIONS, REGION_ORDER } from '@/game/data/levels';
import styles from './page.module.css';

export default function ProfilePage() {
  const {
    playerXp,
    playerLevel,
    currency,
    unlockedCharacters,
    ownedCosmetics,
    characterMastery,
    statistics,
    completedLevels,
    unlockedLevels,
    achievements,
  } = useGameStore();

  const [mounted, setMounted] = useState(false);
  const [favoriteCharacter, setFavoriteCharacter] = useState<string>('kai');

  useEffect(() => { setMounted(true); }, []);

  const characters = getAllCharacters();
  const allAchievements = getAllAchievements();
  const unlockedAchievementIds = getUnlockedAchievements(achievements);
  const totalAchievementPoints = getTotalAchievementPoints();

  const playerLevelConfig = getPlayerLevelConfig(playerLevel);
  const xpProgress = getXpProgress(playerLevel, playerXp);

  const totalStars = Object.values(completedLevels).reduce((sum, l) => sum + l.stars, 0);
  const maxStars = 30 * 3;

  const bossLevels = Object.values(completedLevels).filter((_, key) => 
    Object.keys(completedLevels)[Object.values(completedLevels).indexOf(_)]?.includes('boss')
  );
  const bossesDefeated = Object.entries(completedLevels).filter(([id, data]) => 
    id.includes('boss') && data.stars > 0
  ).length;

  const totalBattles = statistics.totalWins + statistics.totalLosses;
  const accuracy = totalBattles > 0 
    ? Math.round((statistics.totalWins / totalBattles) * 100) 
    : 0;

  const campaignProgress = REGION_ORDER.filter(regionId => {
    const regionLevels = getLevelsByRegion(regionId as any);
    return regionLevels.every(l => completedLevels[l.id]?.stars > 0);
  }).length;

  const favoriteCharMastery = characterMastery[favoriteCharacter] || { level: 1, xp: 0 };
  const favoriteCharConfig = characters.find(c => c.id === favoriteCharacter);

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          PERFIL
        </motion.h1>
        <div className={styles.currencyDisplay}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{currency.toLocaleString()}</span>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="profile-header">
          <motion.div 
            className={styles.profileHeader}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {favoriteCharConfig ? favoriteCharConfig.avatarKey.slice(-1).toUpperCase() : 'K'}
              </div>
              <motion.div 
                className={styles.levelBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                NÍVEL {playerLevel}
              </motion.div>
            </div>
            <div className={styles.profileInfo}>
              <motion.h2 
                className={styles.playerName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                COMANDANTE
              </motion.h2>
              <motion.p 
                className={styles.favoriteCharacter}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Personagem favorito: <strong>{favoriteCharConfig?.name || 'Kai'}</strong> (Maestria {favoriteCharMastery.level}/{MAX_MASTERY_LEVEL})
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            className={styles.xpBar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.xpLabels}>
              <span>XP: {playerXp.toLocaleString()} / {playerLevelConfig?.requiredXp?.toLocaleString() || 'MAX'}</span>
              <span>{Math.round(xpProgress.percent)}%</span>
            </div>
            <div className={styles.progressBarWrapper}>
              <motion.div 
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={Math.round(xpProgress.percent)}
                aria-valuemin={0}
                aria-valuemax={100}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
            <p className={styles.nextReward}>
              {playerLevel < 30 
                ? `Próxima recompensa no nível ${playerLevel + 1}: ${playerLevelConfig?.rewards.map(r => r.id).join(', ') || '—'}`
                : 'Nível máximo atingido!'}
            </p>
          </motion.div>
        </section>

        <section className={styles.section} aria-labelledby="stats-header">
          <motion.h2 
            id="stats-header"
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ESTATÍSTICAS GERAIS
          </motion.h2>
          <div className={styles.statsGrid}>
            {[
              { label: 'Vitórias', value: statistics.totalWins.toLocaleString(), icon: '🏆', color: '#4ade80' },
              { label: 'Derrotas', value: statistics.totalLosses.toLocaleString(), icon: '💀', color: '#f87171' },
              { label: 'Precisão', value: `${accuracy}%`, icon: '🎯', color: '#60a5fa' },
              { label: 'Batalhas', value: totalBattles.toLocaleString(), icon: '⚔️', color: '#a78bfa' },
              { label: 'Estrelas', value: `${totalStars}/${maxStars}`, icon: '⭐', color: '#fbbf24' },
              { label: 'Bosses', value: `${bossesDefeated}/6`, icon: '👑', color: '#f97316' },
              { label: 'Dano Causado', value: statistics.totalDamageDealt.toLocaleString(), icon: '💥', color: '#fb923c' },
              { label: 'Dano Recebido', value: statistics.totalDamageReceived.toLocaleString(), icon: '🛡️', color: '#34d399' },
              { label: 'Especiais', value: statistics.specialsUsed.toLocaleString(), icon: '✨', color: '#a78bfa' },
              { label: 'Vitórias Perfeitas', value: statistics.perfectWins.toLocaleString(), icon: '💎', color: '#22d3ee' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                style={{ borderColor: stat.color }}
              >
                <span className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</span>
                <span className={styles.statValue} style={{ color: stat.color }}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="campaign-header">
          <motion.h2 
            id="campaign-header"
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            PROGRESSO DA CAMPANHA
          </motion.h2>
          <div className={styles.regionProgress}>
            {REGION_ORDER.map((regionId, i) => {
              const region = REGIONS[regionId];
              const regionLevels = getLevelsByRegion(regionId);
              const completedCount = regionLevels.filter(l => completedLevels[l.id]?.stars > 0).length;
              const totalCount = regionLevels.length;
              const regionStars = regionLevels.reduce((sum, l) => sum + (completedLevels[l.id]?.stars || 0), 0);
              const maxRegionStars = totalCount * 3;
              const isCompleted = completedCount === totalCount;
              
              return (
                <motion.div 
                  key={regionId}
                  className={styles.regionCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  style={{ borderColor: region.color }}
                >
                  <div className={styles.regionHeader}>
                    <span className={styles.regionIcon} style={{ color: region.color }}>{region.theme === 'nature' ? '🌿' : region.theme === 'desert' ? '🏜️' : region.theme === 'ice' ? '❄️' : region.theme === 'fire' ? '🔥' : region.theme === 'sky' ? '☁️' : '🌑'}</span>
                    <span className={styles.regionName}>{region.name}</span>
                    <span className={styles.regionProgressText}>{completedCount}/{totalCount}</span>
                  </div>
                  <div className={styles.regionProgressBar}>
                    <motion.div 
                      className={styles.regionProgressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                      style={{ backgroundColor: region.color }}
                    />
                  </div>
                  <div className={styles.regionStars}>
                    <span>⭐ {regionStars}/{maxRegionStars}</span>
                    {isCompleted && <span className={styles.completedBadge}>COMPLETO</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="achievements-header">
          <motion.h2 
            id="achievements-header"
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            CONQUISTAS
          </motion.h2>
          <div className={styles.achievementSummary}>
            <motion.div 
              className={styles.achievementStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className={styles.achievementValue}>{unlockedAchievementIds.length}/{allAchievements.length}</span>
              <span className={styles.achievementLabel}>Desbloqueadas</span>
            </motion.div>
            <motion.div 
              className={styles.achievementStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={styles.achievementValue}>{totalAchievementPoints}</span>
              <span className={styles.achievementLabel}>Pontos Totais</span>
            </motion.div>
            <motion.div 
              className={styles.achievementStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className={styles.achievementValue}>{Math.round((unlockedAchievementIds.length / allAchievements.length) * 100)}%</span>
              <span className={styles.achievementLabel}>Completude</span>
            </motion.div>
          </div>
          <div className={styles.achievementCategories}>
            {['progression', 'combat', 'precision', 'exploration', 'mastery', 'collection', 'special'].map((cat, i) => {
              const catAchievements = allAchievements.filter(a => a.category === cat);
              const catUnlocked = catAchievements.filter(a => unlockedAchievementIds.includes(a.id)).length;
              
              return (
                <motion.div 
                  key={cat}
                  className={styles.achievementCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                >
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryIcon}>{cat === 'progression' ? '📈' : cat === 'combat' ? '⚔️' : cat === 'precision' ? '🎯' : cat === 'exploration' ? '🌍' : cat === 'mastery' ? '🏆' : cat === 'collection' ? '🎨' : '✨'}</span>
                    <span className={styles.categoryName}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span className={styles.categoryProgress}>{catUnlocked}/{catAchievements.length}</span>
                  </div>
                  <div className={styles.categoryProgressBar}>
                    <motion.div 
                      className={styles.categoryProgressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(catUnlocked / catAchievements.length) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="mastery-header">
          <motion.h2 
            id="mastery-header"
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            MAESTRIA DOS PERSONAGENS
          </motion.h2>
          <div className={styles.masteryGrid}>
            {characters.map((char, i) => {
              const mastery = characterMastery[char.id] || { level: 1, xp: 0 };
              const masteryConfig = getMasteryLevelConfig(mastery.level);
              const progress = mastery.level >= MAX_MASTERY_LEVEL ? 100 : getMasteryXpProgress(mastery.level, mastery.xp).percent;
              
              return (
                <motion.div 
                  key={char.id}
                  className={styles.masteryCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  onClick={() => setFavoriteCharacter(char.id)}
                  style={{ borderColor: char.stats.attack > 1 ? '#f87171' : char.stats.defense > 1 ? '#34d399' : char.stats.mobility > 1 ? '#60a5fa' : '#a78bfa' }}
                >
                  <div className={styles.masteryAvatar}>
                    {char.avatarKey.slice(-1).toUpperCase()}
                  </div>
                  <div className={styles.masteryInfo}>
                    <span className={styles.masteryName}>{char.name}</span>
                    <span className={styles.masteryLevel}>Nível {mastery.level}/{MAX_MASTERY_LEVEL}</span>
                  </div>
                  <div className={styles.masteryProgress}>
                    <motion.div 
                      className={styles.masteryProgressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                    />
                  </div>
                  {favoriteCharacter === char.id && <span className={styles.favoriteBadge}>★ FAVORITO</span>}
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="cosmetics-header">
          <motion.h2 
            id="cosmetics-header"
            className={styles.sectionTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            COSMÉTICOS
          </motion.h2>
          <div className={styles.cosmeticSummary}>
            <motion.div 
              className={styles.cosmeticStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className={styles.cosmeticValue}>{ownedCosmetics.length}</span>
              <span className={styles.cosmeticLabel}>Desbloqueados</span>
            </motion.div>
            <motion.div 
              className={styles.cosmeticStat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={styles.cosmeticValue}>{unlockedCharacters.length}/8</span>
              <span className={styles.cosmeticLabel}>Personagens</span>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}