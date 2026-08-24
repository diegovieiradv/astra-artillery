'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import { audioManager } from '@/utils/audio';
import { useI18n } from '@/hooks/useI18n';
import { GraphicsQuality, resolveQuality, getQualityLabel, QUALITY_OPTIONS } from '@/utils/graphicsQuality';
import styles from './page.module.css';

export default function SettingsPage() {
  const { settings, updateSettings } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
    
    if (key === 'musicVolume') {
      audioManager.setVolume('music', value);
    } else if (key === 'sfxVolume') {
      audioManager.setVolume('sfx', value);
    } else if (key === 'musicEnabled') {
      audioManager.setEnabled('music', value);
    } else if (key === 'sfxEnabled') {
      audioManager.setEnabled('sfx', value);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}><div className={styles.spinner} /></div>
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
        <h1 className={styles.title}>CONFIGURAÇÕES</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.section} aria-labelledby="audio-heading">
          <h2 id="audio-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Áudio
          </h2>
          
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Música</span>
              <span className={styles.settingDesc}>Música de fundo do jogo</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={(e) => handleChange('musicEnabled', e.target.checked)}
                aria-label="Ativar música"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Volume da Música</span>
              <span className={styles.settingDesc}>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.musicVolume}
              onChange={(e) => handleChange('musicVolume', parseFloat(e.target.value))}
              className={styles.slider}
              disabled={!settings.musicEnabled}
              aria-label="Volume da música"
            />
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Efeitos Sonoros</span>
              <span className={styles.settingDesc}>Sons de tiros, explosões, interface</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.sfxEnabled}
                onChange={(e) => handleChange('sfxEnabled', e.target.checked)}
                aria-label="Ativar efeitos sonoros"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Volume dos Efeitos</span>
              <span className={styles.settingDesc}>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sfxVolume}
              onChange={(e) => handleChange('sfxVolume', parseFloat(e.target.value))}
              className={styles.slider}
              disabled={!settings.sfxEnabled}
              aria-label="Volume dos efeitos sonoros"
            />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="gameplay-heading">
          <h2 id="gameplay-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M6 3v14M14 3v14" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Jogabilidade
          </h2>
          
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Reduzir Animações</span>
              <span className={styles.settingDesc}>Desativa transições e efeitos visuais</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => handleChange('reduceMotion', e.target.checked)}
                aria-label="Reduzir animações"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Mostrar Números de Dano</span>
              <span className={styles.settingDesc}>Exibe valores de dano durante a batalha</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.showDamageNumbers}
                onChange={(e) => handleChange('showDamageNumbers', e.target.checked)}
                aria-label="Mostrar números de dano"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Vibração (Mobile)</span>
              <span className={styles.settingDesc}>Feedback tátil em dispositivos móveis</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => handleChange('vibrationEnabled', e.target.checked)}
                aria-label="Ativar vibração"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="effects-heading">
          <h2 id="effects-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Efeitos Visuais
          </h2>
          
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Screen Shake</span>
              <span className={styles.settingDesc}>Vibração da câmera em explosões</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.screenShake ?? true}
                onChange={(e) => handleChange('screenShake' as any, e.target.checked)}
                aria-label="Ativar screen shake"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Screen Flash</span>
              <span className={styles.settingDesc}>Flash de tela em eventos críticos</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.screenFlash ?? true}
                onChange={(e) => handleChange('screenFlash' as any, e.target.checked)}
                aria-label="Ativar screen flash"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Partículas</span>
              <span className={styles.settingDesc}>Efeitos de partículas no jogo</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.particles ?? true}
                onChange={(e) => handleChange('particles' as any, e.target.checked)}
                aria-label="Ativar partículas"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="accessibility-heading">
          <h2 id="accessibility-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="4" r="2" />
              <path d="M12 8v8M8 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Acessibilidade
          </h2>
          
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Alto Contraste</span>
              <span className={styles.settingDesc}>Aumenta contraste para melhor visibilidade</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.highContrast ?? false}
                onChange={(e) => handleChange('highContrast' as any, e.target.checked)}
                aria-label="Ativar alto contraste"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Texto Grande</span>
              <span className={styles.settingDesc}>Aumenta o tamanho do texto</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.largeText ?? false}
                onChange={(e) => handleChange('largeText' as any, e.target.checked)}
                aria-label="Ativar texto grande"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Leitor de Tela</span>
              <span className={styles.settingDesc}>Anuncia eventos para leitores de tela</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.screenReader ?? false}
                onChange={(e) => handleChange('screenReader' as any, e.target.checked)}
                aria-label="Ativar leitor de tela"
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="graphics-heading">
          <h2 id="graphics-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('settings.graphics')}
          </h2>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>{t('settings.graphicsQuality')}</span>
              <span className={styles.settingDesc}>{t('settings.graphicsQualityDesc')}</span>
            </div>
            <select
              className={styles.select}
              value={settings.graphicsQuality ?? 'auto'}
              onChange={(e) => {
                const quality = e.target.value as GraphicsQuality;
                const profile = resolveQuality(quality);
                updateSettings({
                  graphicsQuality: quality,
                  particles: profile.particles,
                  screenShake: profile.screenShake,
                  screenFlash: profile.screenFlash,
                  reduceMotion: profile.reduceMotion,
                });
              }}
              aria-label={t('settings.graphicsQuality')}
            >
              {QUALITY_OPTIONS.map((q) => (
                <option key={q} value={q}>{getQualityLabel(q)}</option>
              ))}
            </select>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>{t('settings.particles')}</span>
              <span className={styles.settingDesc}>{t('settings.particlesDesc')}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.particles}
                onChange={(e) => handleChange('particles', e.target.checked)}
                aria-label={t('settings.particles')}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>{t('settings.screenShake')}</span>
              <span className={styles.settingDesc}>{t('settings.screenShakeDesc')}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => handleChange('screenShake', e.target.checked)}
                aria-label={t('settings.screenShake')}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>{t('settings.screenFlash')}</span>
              <span className={styles.settingDesc}>{t('settings.screenFlashDesc')}</span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.screenFlash}
                onChange={(e) => handleChange('screenFlash', e.target.checked)}
                aria-label={t('settings.screenFlash')}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="data-heading">
          <h2 id="data-heading" className={styles.sectionTitle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12V7H5V7M14 7v5a2 2 0 0 1-2 2H7m0 0a2 2 0 0 0 0 4h3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dados
          </h2>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Exportar Save</span>
              <span className={styles.settingDesc}>Copia os dados do jogo para a área de transferência</span>
            </div>
            <button
              className={styles.actionBtn}
              onClick={() => {
                try {
                  const raw = localStorage.getItem('astra-artillery-save');
                  if (raw) {
                    navigator.clipboard.writeText(raw).then(() => {
                      alert('Save copiado para a área de transferência!');
                    });
                  } else {
                    alert('Nenhum save encontrado.');
                  }
                } catch {
                  alert('Erro ao exportar save.');
                }
              }}
            >
              Exportar
            </button>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Importar Save</span>
              <span className={styles.settingDesc}>Cole um save JSON para restaurar o progresso</span>
            </div>
            <button
              className={styles.actionBtn}
              onClick={() => {
                const json = prompt('Cole o JSON do save abaixo:');
                if (!json) return;
                try {
                  const parsed = JSON.parse(json);
                  if (!parsed || typeof parsed !== 'object') throw new Error('Formato invalido');
                  localStorage.setItem('astra-artillery-save', JSON.stringify(parsed));
                  alert('Save importado! Recarregando...');
                  window.location.reload();
                } catch {
                  alert('JSON invalido. Verifique o formato e tente novamente.');
                }
              }}
            >
              Importar
            </button>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Limpar Save</span>
              <span className={styles.settingDesc}>Remove apenas o arquivo de save (mantem configuracoes)</span>
            </div>
            <button
              className={styles.dangerBtn}
              onClick={() => {
                if (confirm('Tem certeza? Isso apagara apenas o save do jogo.')) {
                  localStorage.removeItem('astra-artillery-save');
                  alert('Save removido! Recarregando...');
                  window.location.reload();
                }
              }}
            >
              Limpar
            </button>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>Resetar Progresso</span>
              <span className={styles.settingDesc}>Apaga todo progresso, personagens e configuracoes</span>
            </div>
            <button
              className={styles.dangerBtn}
              onClick={() => {
                if (confirm('Tem certeza? Isso apagara todo seu progresso, personagens desbloqueados e configuracoes.')) {
                  useGameStore.getState().resetProgress();
                }
              }}
            >
              Resetar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}