import * as Phaser from 'phaser';

export type PauseSource = 'manual' | 'menu' | 'tab-blur' | 'loading' | 'cutscene';

export interface PauseState {
  isPaused: boolean;
  sources: Set<PauseSource>;
  pausedAt: number;
  totalPausedTime: number;
}

export class PauseSystem {
  private scene: Phaser.Scene;
  private state: PauseState = {
    isPaused: false,
    sources: new Set(),
    pausedAt: 0,
    totalPausedTime: 0,
  };
  private callbacks: Array<(paused: boolean) => void> = [];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupListeners();
  }
  
  private setupListeners(): void {
    this.scene.events.on('pause', () => {
      this.state.isPaused = true;
    });
    
    this.scene.events.on('resume', () => {
      this.state.isPaused = false;
    });
    
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause('tab-blur');
        } else {
          this.resume('tab-blur');
        }
      });
      
      window.addEventListener('blur', () => {
        this.pause('tab-blur');
      });
      
      window.addEventListener('focus', () => {
        this.resume('tab-blur');
      });
    }
  }
  
  pause(source: PauseSource = 'manual'): void {
    if (this.state.sources.has(source)) return;
    
    this.state.sources.add(source);
    
    if (!this.state.isPaused) {
      this.state.isPaused = true;
      this.state.pausedAt = Date.now();
      this.scene.scene.pause();
      this.notifyCallbacks(true);
    }
  }
  
  resume(source: PauseSource = 'manual'): void {
    if (!this.state.sources.has(source)) return;
    
    this.state.sources.delete(source);
    
    if (this.state.sources.size === 0 && this.state.isPaused) {
      this.state.isPaused = false;
      this.state.totalPausedTime += Date.now() - this.state.pausedAt;
      this.scene.scene.resume();
      this.notifyCallbacks(false);
    }
  }
  
  toggle(source: PauseSource = 'manual'): void {
    if (this.state.sources.has(source)) {
      this.resume(source);
    } else {
      this.pause(source);
    }
  }
  
  isPaused(): boolean {
    return this.state.isPaused;
  }
  
  isPausedBy(source: PauseSource): boolean {
    return this.state.sources.has(source);
  }
  
  getPauseSources(): PauseSource[] {
    return Array.from(this.state.sources);
  }
  
  getTotalPausedTime(): number {
    if (this.state.isPaused) {
      return this.state.totalPausedTime + (Date.now() - this.state.pausedAt);
    }
    return this.state.totalPausedTime;
  }
  
  resetPausedTime(): void {
    this.state.totalPausedTime = 0;
    if (this.state.isPaused) {
      this.state.pausedAt = Date.now();
    }
  }
  
  onPause(callback: (paused: boolean) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx > -1) this.callbacks.splice(idx, 1);
    };
  }
  
  private notifyCallbacks(paused: boolean): void {
    this.callbacks.forEach(cb => cb(paused));
  }
  
  destroy(): void {
    this.callbacks = [];
    this.state.sources.clear();
  }
}
