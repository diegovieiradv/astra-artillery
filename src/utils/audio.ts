type AudioCategory = 'music' | 'sfx' | 'ui';

interface AudioConfig {
  volume: number;
  enabled: boolean;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private gainNodes: Map<AudioCategory, GainNode> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private musicSource: AudioBufferSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private configs: Map<AudioCategory, AudioConfig> = new Map([
    ['music', { volume: 0.5, enabled: true }],
    ['sfx', { volume: 0.7, enabled: true }],
    ['ui', { volume: 0.5, enabled: true }],
  ]);
  private loadingPromises: Map<string, Promise<void>> = new Map();

  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const categories: AudioCategory[] = ['music', 'sfx', 'ui'];
      categories.forEach(cat => {
        const gainNode = this.audioContext!.createGain();
        const config = this.configs.get(cat)!;
        gainNode.gain.value = config.enabled ? config.volume : 0;
        gainNode.connect(this.audioContext!.destination);
        this.gainNodes.set(cat, gainNode);
      });
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  async loadAudio(key: string, url: string, category: AudioCategory = 'sfx'): Promise<void> {
    if (this.audioBuffers.has(key)) return;
    
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }
    
    const promise = this.loadAudioInternal(key, url, category);
    this.loadingPromises.set(key, promise);
    
    try {
      await promise;
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  private async loadAudioInternal(key: string, url: string, category: AudioCategory): Promise<void> {
    const ctx = await this.getAudioContext();
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load audio: ${key}`, error);
      this.audioBuffers.set(key, ctx.createBuffer(1, 1, ctx.sampleRate));
    }
  }

  async play(key: string, category: AudioCategory = 'sfx', options: { loop?: boolean; volume?: number; fadeMs?: number } = {}): Promise<void> {
    if (!this.configs.get(category)?.enabled) return;
    
    let buffer = this.audioBuffers.get(key);
    
    if (!buffer) {
      await this.loadAudio(key, `/audio/${key}.ogg`, category);
      buffer = this.audioBuffers.get(key);
    }
    
    if (!buffer) return;
    
    const ctx = await this.getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop ?? false;
    
    const gainNode = this.gainNodes.get(category)!;
    const localGain = ctx.createGain();
    localGain.connect(gainNode);
    source.connect(localGain);
    
    if (category === 'music') {
      const fadeMs = options.fadeMs ?? 1000;
      const targetVolume = options.volume ?? 1;

      if (this.musicSource && this.musicGain) {
        const oldSource = this.musicSource;
        const oldGain = this.musicGain;
        const now = ctx.currentTime;
        oldGain.gain.setValueAtTime(oldGain.gain.value, now);
        oldGain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
        setTimeout(() => {
          try { oldSource.stop(); } catch { /* already stopped */ }
          oldSource.disconnect();
          oldGain.disconnect();
        }, fadeMs + 50);
      }

      localGain.gain.setValueAtTime(0, ctx.currentTime);
      localGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + fadeMs / 1000);

      this.musicSource = source;
      this.musicGain = localGain;
    } else {
      localGain.gain.value = options.volume ?? 1;
    }
    
    source.start(0);
  }

  stop(key: string, category: AudioCategory = 'sfx'): void {
    // Web Audio API doesn't support stopping specific buffer sources easily without tracking them
    // This is a simplified implementation
  }

  stopMusic(): void {
    if (this.musicSource) {
      this.musicSource.stop();
      this.musicSource.disconnect();
      this.musicSource = null;
    }
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
  }

  async fadeOutMusic(fadeMs: number = 1000): Promise<void> {
    if (!this.musicSource || !this.musicGain) return;
    const ctx = await this.getAudioContext();
    const now = ctx.currentTime;
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
    const oldSource = this.musicSource;
    const oldGain = this.musicGain;
    this.musicSource = null;
    this.musicGain = null;
    setTimeout(() => {
      try { oldSource.stop(); } catch { /* already stopped */ }
      oldSource.disconnect();
      oldGain.disconnect();
    }, fadeMs + 50);
  }

  setVolume(category: AudioCategory, volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const config = this.configs.get(category)!;
    config.volume = clampedVolume;
    
    const gainNode = this.gainNodes.get(category);
    if (gainNode && config.enabled) {
      gainNode.gain.value = clampedVolume;
    }
  }

  setEnabled(category: AudioCategory, enabled: boolean): void {
    const config = this.configs.get(category)!;
    config.enabled = enabled;
    
    const gainNode = this.gainNodes.get(category);
    if (gainNode) {
      gainNode.gain.value = enabled ? config.volume : 0;
    }
    
    if (category === 'music' && !enabled) {
      this.stopMusic();
    }
  }

  getConfig(category: AudioCategory): AudioConfig {
    return { ...this.configs.get(category)! };
  }

  async preloadAll(): Promise<void> {
    const audioFiles = [
      { key: 'bgm_menu', url: '/audio/bgm_menu.ogg', category: 'music' as AudioCategory },
      { key: 'bgm_battle', url: '/audio/bgm_battle.ogg', category: 'music' as AudioCategory },
      { key: 'sfx_shot', url: '/audio/sfx_shot.ogg', category: 'sfx' as AudioCategory },
      { key: 'sfx_explosion', url: '/audio/sfx_explosion.ogg', category: 'sfx' as AudioCategory },
      { key: 'sfx_hit', url: '/audio/sfx_hit.ogg', category: 'sfx' as AudioCategory },
      { key: 'sfx_wind', url: '/audio/sfx_wind.ogg', category: 'sfx' as AudioCategory },
      { key: 'sfx_ui_click', url: '/audio/sfx_ui_click.ogg', category: 'ui' as AudioCategory },
      { key: 'sfx_power_charge', url: '/audio/sfx_power_charge.ogg', category: 'sfx' as AudioCategory },
      { key: 'sfx_ability', url: '/audio/sfx_ability.ogg', category: 'sfx' as AudioCategory },
    ];
    
    await Promise.all(audioFiles.map(f => this.loadAudio(f.key, f.url, f.category)));
  }
}

export const audioManager = new AudioManager();

class VibrationManager {
  private enabled = true;
  private supported = 'vibrate' in navigator;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  vibrate(pattern: number | number[]): void {
    if (!this.enabled || !this.supported) return;
    
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration API may throw in some browsers
    }
  }

  shot(): void {
    this.vibrate([50, 30, 50]);
  }

  explosion(): void {
    this.vibrate([100, 50, 100, 50, 200]);
  }

  hit(): void {
    this.vibrate([30, 20, 30]);
  }

  ability(): void {
    this.vibrate([40, 20, 40, 20, 40]);
  }

  uiClick(): void {
    this.vibrate(10);
  }
}

export const vibrationManager = new VibrationManager();

export function initAudioFromSettings(settings: { 
  musicVolume: number; 
  sfxVolume: number; 
  musicEnabled: boolean; 
  sfxEnabled: boolean; 
  vibrationEnabled: boolean;
}): void {
  audioManager.setVolume('music', settings.musicVolume);
  audioManager.setVolume('sfx', settings.sfxVolume);
  audioManager.setEnabled('music', settings.musicEnabled);
  audioManager.setEnabled('sfx', settings.sfxEnabled);
  vibrationManager.setEnabled(settings.vibrationEnabled);
}