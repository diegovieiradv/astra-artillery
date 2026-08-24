'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { UpgradePanel } from './UpgradePanel';
import { CosmeticsPanel } from './CosmeticsPanel';
import { UPGRADE_CATEGORIES, COSMETICS_DATA } from './constants';
import styles from './page.module.css';

type TabId = 'cannon' | 'armor' | 'mobility' | 'special' | 'cosmetics';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'cannon', label: 'Canhão', icon: '🔫' },
  { id: 'armor', label: 'Armadura', icon: '🛡️' },
  { id: 'mobility', label: 'Mobilidade', icon: '👟' },
  { id: 'special', label: 'Especial', icon: '✨' },
  { id: 'cosmetics', label: 'Cosméticos', icon: '🎨' },
];

export default function WorkshopPage() {
  const {
    currency,
    upgrades,
    ownedCosmetics,
    equippedCosmetics,
    canAfford,
    spendCurrency,
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
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabId>('cannon');
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{ type: 'upgrade' | 'cosmetic'; id: string; cost: number; label: string } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

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

  const handleUpgrade = (type: 'cannon' | 'armor' | 'mobility' | 'special') => {
    const cost = getUpgradeCost(type);
    const level = getUpgradeLevel(type);
    const cat = UPGRADE_CATEGORIES.find(c => c.id === type);
    if (!cat || level >= 10) return;

    setShowConfirm({
      type: 'upgrade',
      id: type,
      cost,
      label: `${cat.label} Nível ${level + 1}`,
    });
  };

  const handleCosmeticClick = (cosmeticId: string) => {
    const cosmetic = COSMETICS_DATA.find(c => c.id === cosmeticId);
    if (!cosmetic) return;

    if (isCosmeticEquipped(cosmeticId)) {
      unequipCosmetic(cosmetic.slot);
      setFeedback({ type: 'success', message: `${cosmetic.name} removido` });
      return;
    }

    if (isCosmeticUnlocked(cosmeticId)) {
      equipCosmetic(cosmetic.slot, cosmeticId);
      setFeedback({ type: 'success', message: `${cosmetic.name} equipado` });
      return;
    }

    if (cosmetic.cost === 0) {
      unlockCosmetic(cosmeticId);
      equipCosmetic(cosmetic.slot, cosmeticId);
      setFeedback({ type: 'success', message: `${cosmetic.name} desbloqueado e equipado` });
      return;
    }

    setShowConfirm({
      type: 'cosmetic',
      id: cosmeticId,
      cost: cosmetic.cost,
      label: cosmetic.name,
    });
  };

  const confirmPurchase = () => {
    if (!showConfirm) return;

    if (!canAfford(showConfirm.cost)) {
      setFeedback({ type: 'error', message: 'Astra Credits insuficientes!' });
      setShowConfirm(null);
      return;
    }

    spendCurrency(showConfirm.cost);

    if (showConfirm.type === 'upgrade') {
      const success =
        showConfirm.id === 'cannon' ? upgradeCannon() :
        showConfirm.id === 'armor' ? upgradeArmor() :
        showConfirm.id === 'mobility' ? upgradeMobility() :
        upgradeSpecial();

      if (success) {
        setFeedback({ type: 'success', message: `${showConfirm.label} melhorado!` });
      } else {
        setFeedback({ type: 'error', message: 'Falha ao melhorar' });
      }
    } else {
      const cosmetic = COSMETICS_DATA.find(c => c.id === showConfirm.id);
      if (cosmetic) {
        unlockCosmetic(showConfirm.id);
        equipCosmetic(cosmetic.slot, showConfirm.id);
        setFeedback({ type: 'success', message: `${cosmetic.name} desbloqueado e equipado!` });
      }
    }

    setShowConfirm(null);
  };

  const renderUpgradeTab = () => {
    const type = activeTab as 'cannon' | 'armor' | 'mobility' | 'special';
    return (
      <UpgradePanel
        category={type}
        currentLevel={getUpgradeLevel(type)}
        nextCost={getUpgradeCost(type)}
        currentStats={getUpgradeStats(type)}
        onUpgrade={handleUpgrade}
        maxLevel={10}
      />
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>OFICINA</h1>
        <div className={styles.balance} aria-label={`Saldo: ${currency} Astra Credits`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {currency.toLocaleString()}
        </div>
      </header>

      <main className={styles.main}>
        <nav className={styles.tabs} role="tablist" aria-label="Categorias da oficina">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              <span className={styles.tabIcon} aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            id={`panel-${activeTab}`}
            role="tabpanel"
          >
            {activeTab === 'cosmetics' ? (
              <CosmeticsPanel
                onCosmeticClick={handleCosmeticClick}
                isUnlocked={isCosmeticUnlocked}
                isEquipped={isCosmeticEquipped}
              />
            ) : (
              renderUpgradeTab()
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 24px',
                borderRadius: 12,
                background: feedback.type === 'success' ? '#166534' : '#991b1b',
                color: '#f8fafc',
                fontWeight: 600,
                fontSize: '0.9rem',
                zIndex: 1000,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
              role="status"
              aria-live="polite"
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999,
                padding: 16,
              }}
              onClick={() => setShowConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: '#1e293b',
                  borderRadius: 16,
                  padding: '2rem',
                  maxWidth: 360,
                  width: '100%',
                  border: '1px solid #334155',
                  textAlign: 'center',
                }}
                role="dialog"
                aria-label="Confirmar compra"
              >
                <h2 style={{ fontSize: '1.1rem', marginBottom: 12, color: '#f8fafc' }}>
                  Confirmar Compra
                </h2>
                <p style={{ color: '#94a3b8', marginBottom: 8, fontSize: '0.9rem' }}>
                  {showConfirm.label}
                </p>
                <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>
                  {showConfirm.cost.toLocaleString()} Credits
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setShowConfirm(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      border: '1px solid #475569',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmPurchase}
                    disabled={!canAfford(showConfirm.cost)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 10,
                      border: 'none',
                      background: canAfford(showConfirm.cost) ? '#4ade80' : '#334155',
                      color: canAfford(showConfirm.cost) ? '#0a0a0a' : '#64748b',
                      fontWeight: 700,
                      cursor: canAfford(showConfirm.cost) ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {canAfford(showConfirm.cost) ? 'COMPRAR' : 'SALDO INSUFICIENTE'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
