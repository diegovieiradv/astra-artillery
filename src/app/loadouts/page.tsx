'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllCharacters } from '@/game/characters/registry';
import styles from './page.module.css';

interface LoadoutPreset {
  id: string;
  name: string;
  characterId: string;
  projectile: string;
  equipment: string[];
  createdAt: string;
}

const STORAGE_KEY = 'astra-artillery-loadouts';
const PROJECTILE_OPTIONS = ['normal', 'piercing', 'bouncing', 'cluster'];

function getLoadouts(): LoadoutPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLoadouts(loadouts: LoadoutPreset[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts)); } catch {}
}

export default function LoadoutsPage() {
  const characters = getAllCharacters();
  const [loadouts, setLoadouts] = useState<LoadoutPreset[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCharacter, setFormCharacter] = useState('kai');
  const [formProjectile, setFormProjectile] = useState('normal');

  useEffect(() => {
    setMounted(true);
    setLoadouts(getLoadouts());
  }, []);

  const handleSave = () => {
    if (!formName.trim()) return;
    const updated = loadouts.filter(l => l.id !== editingId);
    const newLoadout: LoadoutPreset = {
      id: editingId || `loadout-${Date.now()}`,
      name: formName.trim(),
      characterId: formCharacter,
      projectile: formProjectile,
      equipment: [],
      createdAt: new Date().toISOString(),
    };
    updated.push(newLoadout);
    saveLoadouts(updated);
    setLoadouts(updated);
    setEditingId(null);
    setFormName('');
    setFormCharacter('kai');
    setFormProjectile('normal');
  };

  const handleEdit = (loadout: LoadoutPreset) => {
    setEditingId(loadout.id);
    setFormName(loadout.name);
    setFormCharacter(loadout.characterId);
    setFormProjectile(loadout.projectile);
  };

  const handleDelete = (id: string) => {
    const updated = loadouts.filter(l => l.id !== id);
    saveLoadouts(updated);
    setLoadouts(updated);
    if (editingId === id) setEditingId(null);
  };

  if (!mounted) return <div className={styles.loading}><div className={styles.spinner} /></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Voltar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <h1 className={styles.title}>PRESET DE EQUIPE</h1>
        <div style={{ width: 40 }} />
      </header>

      <main className={styles.main}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={styles.cardTitle}>{editingId ? 'EDITAR PRESET' : 'NOVO PRESET'}</h2>
          <input
            className={styles.input}
            type="text"
            placeholder="Nome do preset"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            maxLength={30}
          />
          <div className={styles.charSelect}>
            {characters.map(c => (
              <button
                key={c.id}
                className={`${styles.charBtn} ${formCharacter === c.id ? styles.charBtnActive : ''}`}
                onClick={() => setFormCharacter(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className={styles.projSelect}>
            {PROJECTILE_OPTIONS.map(p => (
              <button
                key={p}
                className={`${styles.projBtn} ${formProjectile === p ? styles.projBtnActive : ''}`}
                onClick={() => setFormProjectile(p)}
              >
                {p === 'normal' ? 'Normal' : p === 'piercing' ? 'Perfurante' : p === 'bouncing' ? 'Saltitante' : 'Explosivo'}
              </button>
            ))}
          </div>
          <motion.button
            className={styles.saveBtn}
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {editingId ? 'SALVAR ALTERACOES' : 'CRIAR PRESET'}
          </motion.button>
          {editingId && (
            <button className={styles.cancelBtn} onClick={() => { setEditingId(null); setFormName(''); setFormCharacter('kai'); setFormProjectile('normal'); }}>
              Cancelar
            </button>
          )}
        </motion.div>

        <div className={styles.loadoutList}>
          {loadouts.length === 0 ? (
            <p className={styles.emptyText}>Nenhum preset criado ainda.</p>
          ) : (
            loadouts.map((loadout) => {
              const char = characters.find(c => c.id === loadout.characterId);
              return (
                <div key={loadout.id} className={styles.loadoutItem}>
                  <div className={styles.loadoutInfo}>
                    <span className={styles.loadoutName}>{loadout.name}</span>
                    <span className={styles.loadoutChar}>{char?.name || loadout.characterId}</span>
                    <span className={styles.loadoutProj}>{loadout.projectile}</span>
                  </div>
                  <div className={styles.loadoutActions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(loadout)}>Editar</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(loadout.id)}>Excluir</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
