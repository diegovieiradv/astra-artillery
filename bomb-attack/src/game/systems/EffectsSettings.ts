export interface EffectsSettings {
  screenShake: boolean;
  screenFlash: boolean;
  particles: boolean;
  damageNumbers: boolean;
  hapticFeedback: boolean;
  soundVariations: boolean;
  contextualFeedback: boolean;
  animations: boolean;
  reduceMotion: boolean;
}

const DEFAULT_SETTINGS: EffectsSettings = {
  screenShake: true,
  screenFlash: true,
  particles: true,
  damageNumbers: true,
  hapticFeedback: true,
  soundVariations: true,
  contextualFeedback: true,
  animations: true,
  reduceMotion: false,
};

const STORAGE_KEY = 'astra_effects_settings';

export class EffectsSettingsManager {
  private settings: EffectsSettings;
  private callbacks: Array<(settings: EffectsSettings) => void> = [];
  
  constructor() {
    this.settings = this.loadSettings();
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        this.settings.reduceMotion = true;
        this.applyReduceMotion();
      }
      
      prefersReducedMotion.addEventListener('change', (e) => {
        this.settings.reduceMotion = e.matches;
        this.applyReduceMotion();
        this.saveSettings();
        this.notifyCallbacks();
      });
    }
  }
  
  private loadSettings(): EffectsSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load effects settings:', e);
    }
    
    return { ...DEFAULT_SETTINGS };
  }
  
  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save effects settings:', e);
    }
  }
  
  private applyReduceMotion(): void {
    if (this.settings.reduceMotion) {
      this.settings.screenShake = false;
      this.settings.particles = false;
      this.settings.animations = false;
    }
  }
  
  private notifyCallbacks(): void {
    this.callbacks.forEach(cb => cb(this.settings));
  }
  
  getSettings(): EffectsSettings {
    return { ...this.settings };
  }
  
  updateSetting<K extends keyof EffectsSettings>(key: K, value: EffectsSettings[K]): void {
    this.settings[key] = value;
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  updateSettings(settings: Partial<EffectsSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  isScreenShakeEnabled(): boolean {
    return this.settings.screenShake && !this.settings.reduceMotion;
  }
  
  isScreenFlashEnabled(): boolean {
    return this.settings.screenFlash && !this.settings.reduceMotion;
  }
  
  isParticlesEnabled(): boolean {
    return this.settings.particles && !this.settings.reduceMotion;
  }
  
  isDamageNumbersEnabled(): boolean {
    return this.settings.damageNumbers;
  }
  
  isHapticEnabled(): boolean {
    return this.settings.hapticFeedback;
  }
  
  isSoundVariationsEnabled(): boolean {
    return this.settings.soundVariations;
  }
  
  isContextualFeedbackEnabled(): boolean {
    return this.settings.contextualFeedback;
  }
  
  isAnimationsEnabled(): boolean {
    return this.settings.animations && !this.settings.reduceMotion;
  }
  
  isReduceMotionEnabled(): boolean {
    return this.settings.reduceMotion;
  }
  
  onChange(callback: (settings: EffectsSettings) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx > -1) this.callbacks.splice(idx, 1);
    };
  }
  
  destroy(): void {
    this.callbacks = [];
  }
}

let instance: EffectsSettingsManager | null = null;

export function getEffectsSettings(): EffectsSettingsManager {
  if (!instance) {
    instance = new EffectsSettingsManager();
  }
  return instance;
}

export default EffectsSettingsManager;
