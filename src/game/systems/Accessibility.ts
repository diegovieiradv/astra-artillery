export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reduceMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  focusIndicator: boolean;
  ariaLabels: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  reduceMotion: false,
  colorBlindMode: 'none',
  focusIndicator: true,
  ariaLabels: true,
};

const STORAGE_KEY = 'astra_accessibility_settings';

export class AccessibilityManager {
  private settings: AccessibilitySettings;
  private callbacks: Array<(settings: AccessibilitySettings) => void> = [];
  
  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        this.settings.reduceMotion = true;
        this.applySettings();
      }
      
      const prefersContrast = window.matchMedia('(prefers-contrast: more)');
      if (prefersContrast.matches) {
        this.settings.highContrast = true;
        this.applySettings();
      }
      
      prefersReducedMotion.addEventListener('change', (e) => {
        this.settings.reduceMotion = e.matches;
        this.applySettings();
        this.saveSettings();
        this.notifyCallbacks();
      });
      
      prefersContrast.addEventListener('change', (e) => {
        this.settings.highContrast = e.matches;
        this.applySettings();
        this.saveSettings();
        this.notifyCallbacks();
      });
    }
  }
  
  private loadSettings(): AccessibilitySettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load accessibility settings:', e);
    }
    
    return { ...DEFAULT_SETTINGS };
  }
  
  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save accessibility settings:', e);
    }
  }
  
  private applySettings(): void {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (this.settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (this.settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    if (this.settings.focusIndicator) {
      root.classList.add('focus-indicator');
    } else {
      root.classList.remove('focus-indicator');
    }
    
    root.setAttribute('data-color-blind', this.settings.colorBlindMode);
  }
  
  private notifyCallbacks(): void {
    this.callbacks.forEach(cb => cb(this.settings));
  }
  
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }
  
  updateSetting<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]): void {
    this.settings[key] = value;
    this.applySettings();
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  updateSettings(settings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.applySettings();
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.applySettings();
    this.saveSettings();
    this.notifyCallbacks();
  }
  
  isHighContrast(): boolean {
    return this.settings.highContrast;
  }
  
  isLargeText(): boolean {
    return this.settings.largeText;
  }
  
  isScreenReaderEnabled(): boolean {
    return this.settings.screenReader;
  }
  
  isKeyboardNavigationEnabled(): boolean {
    return this.settings.keyboardNavigation;
  }
  
  isReduceMotionEnabled(): boolean {
    return this.settings.reduceMotion;
  }
  
  getColorBlindMode(): string {
    return this.settings.colorBlindMode;
  }
  
  announceToScreenReader(message: string): void {
    if (!this.settings.screenReader || typeof document === 'undefined') return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  onChange(callback: (settings: AccessibilitySettings) => void): () => void {
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

let instance: AccessibilityManager | null = null;

export function getAccessibility(): AccessibilityManager {
  if (!instance) {
    instance = new AccessibilityManager();
  }
  return instance;
}

export default AccessibilityManager;
