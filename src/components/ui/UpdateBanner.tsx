'use client';

import { useState } from 'react';
import { useSWUpdate } from '@/hooks/useSWUpdate';
import styles from './UpdateBanner.module.css';

export function UpdateBanner() {
  const { isUpdateAvailable, isUpdated, applyUpdate } = useSWUpdate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!isUpdateAvailable && !isUpdated)) return null;

  if (isUpdated) {
    return (
      <div className={`${styles.banner} ${styles.success}`} role="status" aria-live="polite">
        <span className={styles.text}>Versão atualizada!</span>
        <button
          className={styles.dismiss}
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.banner} ${styles.update}`} role="alert" aria-live="assertive">
      <span className={styles.text}>
        Nova versão disponível!
      </span>
      <div className={styles.actions}>
        <button className={styles.applyBtn} onClick={applyUpdate}>
          Atualizar
        </button>
        <button
          className={styles.dismiss}
          onClick={() => setDismissed(true)}
          aria-label="Dispensar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
