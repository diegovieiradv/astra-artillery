'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { COSMETIC_SLOTS, COSMETICS_DATA } from './constants';

interface CosmeticsPanelProps {
  onCosmeticClick: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  isEquipped: (id: string) => boolean;
}

export function CosmeticsPanel({ 
  onCosmeticClick, 
  isUnlocked, 
  isEquipped 
}: CosmeticsPanelProps) {
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
                    <button
                      key={cosmetic.id}
                      className={`cosmeticCard ${equipped ? 'equipped' : ''} ${!unlocked ? 'locked' : ''}`}
                      onClick={() => onCosmeticClick(cosmetic.id)}
                      disabled={!unlocked && cosmetic.cost === 0}
                      style={{ borderColor: rarityColors[cosmetic.rarity] }}
                    >
                      <span className="cosmeticPreview">{cosmetic.preview}</span>
                      <span className="cosmeticName">{cosmetic.name}</span>
                      <span className={`cosmeticRarity rarity-${cosmetic.rarity}`}>
                        {cosmetic.rarity.charAt(0).toUpperCase() + cosmetic.rarity.slice(1)}
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
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="cosmeticsHint">Cosméticos não afetam atributos de combate. Apenas aparência visual.</p>
    </div>
  );
}
