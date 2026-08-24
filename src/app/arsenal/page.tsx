'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTILE_TYPES, ProjectileTypeConfig, ProjectileTypeId } from '@/game/data/projectiles';
import { TACTICAL_ITEMS, TacticalItemConfig } from '@/game/data/tacticalItems';
import styles from './page.module.css';

type TabId = 'projectiles' | 'tactical';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'projectiles', label: 'Projéteis', icon: '💣' },
  { id: 'tactical', label: 'Itens Táticos', icon: '🧪' },
];

const BEHAVIOR_LABELS: Record<string, string> = {
  normal: 'Equilibrado',
  heavy: 'Pesado',
  cluster: 'Em Cacho',
  piercing: 'Perfurante',
  fire: 'Incendiário',
  ice: 'Congelante',
  electric: 'Elétrico',
  bounce: 'Ricochete',
  multi: 'Múltiplo',
  tactical: 'Tático',
};

const RARITY_LABELS: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

const RARITY_COLORS: Record<string, string> = {
  common: '#64748b',
  rare: '#60a5fa',
  epic: '#a78bfa',
  legendary: '#fbbf24',
};

export default function ArsenalPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('projectiles');
  const [selectedItem, setSelectedItem] = useState<ProjectileTypeConfig | TacticalItemConfig | null>(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Carregando arsenal...</p>
        </div>
      </div>
    );
  }

  const projectiles = Object.values(PROJECTILE_TYPES);
  const tactical = TACTICAL_ITEMS;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>ARSENAL</h1>
        <div className={styles.count}>
          {projectiles.length} projéteis · {tactical.length} itens
        </div>
      </header>

      <main className={styles.main}>
        <nav className={styles.tabs} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'projectiles' ? (
              <div className={styles.grid}>
                {projectiles.map((proj) => (
                  <div
                    key={proj.id}
                    className={`${styles.card} ${proj.isDefault ? styles.defaultCard : ''}`}
                    onClick={() => setSelectedItem(proj)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.cardIcon} style={{ background: proj.visual.color }}>
                      {proj.behavior === 'normal' && '🔵'}
                      {proj.behavior === 'heavy' && '🔴'}
                      {proj.behavior === 'cluster' && '🟣'}
                      {proj.behavior === 'piercing' && '🔵'}
                      {proj.behavior === 'fire' && '🟠'}
                      {proj.behavior === 'ice' && '❄️'}
                      {proj.behavior === 'electric' && '⚡'}
                      {proj.behavior === 'bounce' && '🟢'}
                      {proj.behavior === 'multi' && '💗'}
                      {proj.behavior === 'tactical' && '🟣'}
                    </div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardName}>{proj.name}</h3>
                      <span className={styles.cardBehavior}>
                        {BEHAVIOR_LABELS[proj.behavior]}
                      </span>
                    </div>
                    {proj.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.grid}>
                {tactical.map((item) => (
                  <div
                    key={item.id}
                    className={styles.card}
                    onClick={() => setSelectedItem(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.cardIcon} style={{ background: item.visual?.color || '#64748b' }}>
                      {item.icon}
                    </div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardName}>{item.name}</h3>
                      <span className={styles.cardRarity} style={{ color: RARITY_COLORS[item.rarity] }}>
                        {RARITY_LABELS[item.rarity]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedItem && 'behavior' in selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modal}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={selectedItem.name}
              >
                <div className={styles.modalHeader}>
                  <div className={styles.modalIcon} style={{ background: (selectedItem as ProjectileTypeConfig).visual.color }}>
                    💣
                  </div>
                  <div>
                    <h2>{selectedItem.name}</h2>
                    <span className={styles.modalBehavior}>
                      {BEHAVIOR_LABELS[(selectedItem as ProjectileTypeConfig).behavior]}
                    </span>
                  </div>
                </div>
                <p className={styles.modalDesc}>{selectedItem.description}</p>

                <div className={styles.statsGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Dano</span>
                    <span className={styles.statValue}>
                      {Math.round((selectedItem as ProjectileTypeConfig).physics.damageMultiplier * 100)}%
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Raio</span>
                    <span className={styles.statValue}>
                      {(selectedItem as ProjectileTypeConfig).physics.explosionRadius}px
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Velocidade</span>
                    <span className={styles.statValue}>
                      {Math.round((selectedItem as ProjectileTypeConfig).physics.speedModifier * 100)}%
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Vento</span>
                    <span className={styles.statValue}>
                      {Math.round((selectedItem as ProjectileTypeConfig).physics.windModifier * 100)}%
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Gravidade</span>
                    <span className={styles.statValue}>
                      {Math.round((selectedItem as ProjectileTypeConfig).physics.gravityModifier * 100)}%
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Massa</span>
                    <span className={styles.statValue}>
                      {(selectedItem as ProjectileTypeConfig).physics.mass}x
                    </span>
                  </div>
                </div>

                {(selectedItem as ProjectileTypeConfig).unlockRequirement && (
                  <div className={styles.unlockInfo}>
                    🔒 Desbloqueio: {(selectedItem as ProjectileTypeConfig).unlockRequirement!.value}
                  </div>
                )}

                <button onClick={() => setSelectedItem(null)} className={styles.closeBtn}>
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}

          {selectedItem && 'cooldown' in selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.modal}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={selectedItem.name}
              >
                <div className={styles.modalHeader}>
                  <div className={styles.modalIcon} style={{ background: (selectedItem as TacticalItemConfig).visual?.color || '#64748b' }}>
                    {(selectedItem as TacticalItemConfig).icon}
                  </div>
                  <div>
                    <h2>{selectedItem.name}</h2>
                    <span className={styles.modalRarity} style={{ color: RARITY_COLORS[(selectedItem as TacticalItemConfig).rarity] }}>
                      {RARITY_LABELS[(selectedItem as TacticalItemConfig).rarity]}
                    </span>
                  </div>
                </div>
                <p className={styles.modalDesc}>{selectedItem.description}</p>

                <div className={styles.statsGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Cargas</span>
                    <span className={styles.statValue}>{(selectedItem as TacticalItemConfig).maxCharges}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Preço</span>
                    <span className={styles.statValue}>{(selectedItem as TacticalItemConfig).cost}c</span>
                  </div>
                </div>

                <div className={styles.effectsList}>
                  <h3>Efeitos</h3>
                  {(selectedItem as TacticalItemConfig).effects.map((eff, i) => (
                    <div key={i} className={styles.effect}>
                      <span>{eff.type.replace(/_/g, ' ')}</span>
                      <span className={styles.effectValue}>
                        {eff.type === 'heal' ? `${Math.round(eff.value * 100)}%` : eff.value}
                        {eff.duration ? ` (${eff.duration}t)` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <button onClick={() => setSelectedItem(null)} className={styles.closeBtn}>
                  Fechar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
