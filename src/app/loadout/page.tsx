'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { 
  RARITY_LABELS,
  RARITY_COLORS,
  COSMETIC_SLOTS,
  COSMETICS_DATA,
  UPGRADE_TABS
} from '@/game/data/inventory';
import { getAllCharacters } from '@/game/characters/registry';
import styles from './page.module.css';

export default function LoadoutPage() {
  const { 
    currency, 
    upgrades, 
    ownedCosmetics, 
    equippedCosmetics,
    canAfford, 
    spendCurrency, 
    earnCurrency,
    upgradeCannon, 
    upgradeArmor, 
    upgradeMobility, 
    upgradeSpecial,
    getUpgradeCost, 
    getUpgradeLevel, 
    getUpgradeStats,
    unlockCosmetic, 
    equipCosmetic, 
    unequipCosmetic,
    isCosmeticUnlocked, 
    isCosmeticEquipped,
    loadout,
    setLoadout,
  } = useGameStore();
  
  const [activeTab, setActiveTab] = useState<'cannon' | 'armor' | 'mobility' | 'special' | 'cosmetics'>('cannon');
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{ type: 'upgrade' | 'cosmetic'; id: string; cost: number } | null>(null);
  const [purchaseFeedback, setPurchaseFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleUpgradeClick = (type: 'cannon' | 'armor' | 'mobility' | 'special') => {
    const cost = getUpgradeCost(type);
    const level = getUpgradeLevel(type);
    if (level >= 10) return;
    setShowConfirm({ type: 'upgrade', id: type, cost });
  };

  const handleCosmeticClick = (cosmeticId: string) => {
    const cosmetic = COSMETICS_DATA.find(c => c.id === cosmeticId);
    if (!cosmetic) return;
    if (isCosmeticUnlocked(cosmeticId)) {
      if (isCosmeticEquipped(cosmeticId)) {
        unequipCosmetic(cosmetic.slot);
      } else {
        equipCosmetic(cosmetic.slot, cosmeticId);
      }
    } else {
      setShowConfirm({ type: 'cosmetic', id: cosmeticId, cost: cosmetic.cost });
    }
  };

  const handleConfirmPurchase = () => {
    if (!showConfirm) return;
    
    if (showConfirm.type === 'upgrade') {
      const success = spendCurrency(showConfirm.cost);
      if (success) {
        const upgradeMap: Record<string, () => void> = {
          cannon: upgradeCannon,
          armor: upgradeArmor,
          mobility: upgradeMobility,
          special: upgradeSpecial,
        };
        const upgradeFn = upgradeMap[showConfirm.id];
        if (upgradeFn) upgradeFn();
        setPurchaseFeedback({ type: 'success', message: 'Melhoria comprada com sucesso!' });
      } else {
        setPurchaseFeedback({ type: 'error', message: 'Moedas insuficientes!' });
      }
    } else {
      const cosmetic = COSMETICS_DATA.find(c => c.id === showConfirm.id);
      if (cosmetic && spendCurrency(showConfirm.cost)) {
        unlockCosmetic(showConfirm.id);
        equipCosmetic(cosmetic.slot, showConfirm.id);
        setPurchaseFeedback({ type: 'success', message: 'Cosmético desbloqueado e equipado!' });
      } else {
        setPurchaseFeedback({ type: 'error', message: 'Moedas insuficientes!' });
      }
    }
    setShowConfirm(null);
    setTimeout(() => setPurchaseFeedback(null), 3000);
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando oficina...</p>
        </div>
      </div>
    );
  }

  const currentCategory = UPGRADE_TABS.find(c => c.id === activeTab);
  const currentLevel = currentCategory ? getUpgradeLevel(activeTab as any) : 0;
  const nextCost = currentCategory ? getUpgradeCost(activeTab as any) : 0;
  const currentStats = currentCategory ? getUpgradeStats(activeTab as any) : {};

  const tabVariants = {
    inactive: { opacity: 0.6, scale: 1 },
    active: { opacity: 1, scale: 1.02, boxShadow: `0 0 0 2px ${currentCategory?.color}, 0 8px 24px ${currentCategory?.color}40` },
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div className={styles.headerCenter}>
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            OFICINA
          </motion.h1>
          <motion.div 
            className={styles.currencyDisplay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{currency.toLocaleString()}</span>
          </motion.div>
        </div>
        <Link href="/map" className={styles.mapBtn} aria-label="Voltar ao mapa">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </Link>
      </header>

      <div className={styles.tabBar} role="tablist" aria-label="Categorias de melhorias">
        {UPGRADE_TABS.map((cat, index) => (
          <motion.button
            key={cat.id}
            className={`${styles.tab} ${activeTab === cat.id ? styles.active : ''}`}
            onClick={() => setActiveTab(cat.id as any)}
            role="tab"
            aria-selected={activeTab === cat.id}
            aria-controls={`${cat.id}-panel`}
            variants={tabVariants}
            whileHover={activeTab !== cat.id ? { scale: 1.05 } : undefined}
            whileTap={activeTab !== cat.id ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.2 }}
            style={{ transitionDelay: `${index * 0.05}s` }}
          >
            <span className={styles.tabIcon} style={{ color: cat.color }}>{cat.icon}</span>
            <span className={styles.tabLabel}>{cat.label}</span>
            {cat.id !== 'cosmetics' && (
              <motion.span
                className={styles.tabLevel}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                Lv.{getUpgradeLevel(cat.id as any)}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`${activeTab}-panel`}
          role="tabpanel"
          className={styles.panel}
          initial={{ opacity: 0, x: activeTab === 'cosmetics' ? 0 : 20, y: activeTab === 'cosmetics' ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeTab === 'cosmetics' ? (
            <CosmeticsPanel 
              onCosmeticClick={handleCosmeticClick}
              isUnlocked={isCosmeticUnlocked}
              isEquipped={isCosmeticEquipped}
            />
          ) : (
            <UpgradePanel
              category={activeTab as 'cannon' | 'armor' | 'mobility' | 'special'}
              currentLevel={currentLevel}
              nextCost={nextCost}
              currentStats={currentStats}
              onUpgrade={handleUpgradeClick}
              maxLevel={10}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showConfirm && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h2 id="modal-title" className={styles.modalTitle}>
              {showConfirm.type === 'upgrade' ? 'Confirmar Melhoria' : 'Desbloquear Cosmético'}
            </h2>
            <p className={styles.modalText}>
              {showConfirm.type === 'upgrade' 
                ? `Deseja melhorar ${UPGRADE_TABS.find(c => c.id === showConfirm.id)?.label} para o nível ${getUpgradeLevel(showConfirm.id as any) + 1}?`
                : `Deseja desbloquear "${COSMETICS_DATA.find(c => c.id === showConfirm.id)?.name}"?`}
            </p>
            <div className={styles.modalCost}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{showConfirm.cost.toLocaleString()}</span>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowConfirm(null)}
              >
                Cancelar
              </button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleConfirmPurchase}
                style={{ backgroundColor: currentCategory?.color }}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {purchaseFeedback && (
        <motion.div 
          className={`${styles.toast} ${purchaseFeedback.type === 'success' ? styles.toastSuccess : styles.toastError}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          role="alert"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {purchaseFeedback.type === 'success' ? (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </>
            )}
          </svg>
          <span>{purchaseFeedback.message}</span>
        </motion.div>
      )}
    </div>
  );
}

function UpgradePanel({ 
  category, 
  currentLevel, 
  nextCost, 
  currentStats, 
  onUpgrade,
  maxLevel = 10,
}: {
  category: 'cannon' | 'armor' | 'mobility' | 'special';
  currentLevel: number;
  nextCost: number;
  currentStats: Record<string, number>;
  onUpgrade: (type: 'cannon' | 'armor' | 'mobility' | 'special') => void;
  maxLevel: number;
}) {
  const catInfo = UPGRADE_TABS.find(c => c.id === category)!;
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

      <motion.button
        className={`upgradeBtn ${isMax ? 'disabled' : ''}`}
        onClick={() => !isMax && onUpgrade(category)}
        disabled={isMax}
        aria-disabled={isMax}
        whileHover={!isMax ? { scale: 1.02 } : undefined}
        whileTap={!isMax ? { scale: 0.98 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isMax ? 'NÍVEL MÁXIMO ATINGIDO' : 'MELHORAR'}
      </motion.button>

      <motion.div 
        className="description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>{catInfo.description}</p>
      </motion.div>
    </div>
  );
}

function CosmeticsPanel({ 
  onCosmeticClick, 
  isUnlocked, 
  isEquipped 
}: { 
  onCosmeticClick: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  isEquipped: (id: string) => boolean;
}) {
  const rarityColors: Record<string, string> = {
    common: '#64748b',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fbbf24',
  };

  return (
    <div className="cosmeticsPanel">
      <div className="cosmeticSlots">
        {COSMETIC_SLOTS.map((slot, index) => {
          const slotCosmetics = COSMETICS_DATA.filter(c => c.slot === slot.id);
          return (
            <motion.div 
              key={slot.id}
              className="cosmeticSlot"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <h3 className="slotTitle">
                <span className="slotIcon">{slot.icon}</span>
                {slot.label}
              </h3>
              <div className="cosmeticGrid">
                {slotCosmetics.map((cosmetic) => {
                  const unlocked = isUnlocked(cosmetic.id);
                  const equipped = isEquipped(cosmetic.id);
                  return (
                    <motion.button
                      key={cosmetic.id}
                      className={`cosmeticCard ${equipped ? 'equipped' : ''} ${!unlocked ? 'locked' : ''}`}
                      onClick={() => onCosmeticClick(cosmetic.id)}
                      disabled={!unlocked && cosmetic.cost === 0}
                      whileHover={unlocked ? { scale: 1.05 } : undefined}
                      whileTap={unlocked ? { scale: 0.95 } : undefined}
                      style={{ borderColor: rarityColors[cosmetic.rarity] }}
                    >
                      <span className="cosmeticPreview">{cosmetic.preview}</span>
                      <span className="cosmeticName">{cosmetic.name}</span>
                      <span className={`cosmeticRarity rarity-${cosmetic.rarity}`}>
                        {RARITY_LABELS[cosmetic.rarity]}
                      </span>
                      {!unlocked && cosmetic.cost > 0 && (
                        <span className="cosmeticCost">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {cosmetic.cost}
                        </span>
                      )}
                      {equipped && <span className="equippedBadge">EQUIPADO</span>}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
      <motion.p className="cosmeticsHint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Cosméticos não afetam atributos de combate. Apenas aparência visual.
      </motion.p>
    </div>
  );
}