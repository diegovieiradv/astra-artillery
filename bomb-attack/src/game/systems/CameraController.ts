import * as Phaser from 'phaser';

export type CameraShakeIntensity = 'light' | 'medium' | 'heavy' | 'boss';

export type CameraState = 'idle' | 'following' | 'zooming' | 'returning';

export interface CameraControllerConfig {
  followSpeed: number;
  zoomSpeed: number;
  returnSpeed: number;
  shakeDurations: Record<CameraShakeIntensity, number>;
  shakeIntensities: Record<CameraShakeIntensity, number>;
  zoomLevels: {
    normal: number;
    focused: number;
    bossIntro: number;
    special: number;
  };
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const DEFAULT_CONFIG: CameraControllerConfig = {
  followSpeed: 0.08,
  zoomSpeed: 0.05,
  returnSpeed: 0.06,
  shakeDurations: {
    light: 150,
    medium: 250,
    heavy: 400,
    boss: 500,
  },
  shakeIntensities: {
    light: 0.005,
    medium: 0.01,
    heavy: 0.02,
    boss: 0.03,
  },
  zoomLevels: {
    normal: 1,
    focused: 1.2,
    bossIntro: 1.5,
    special: 1.3,
  },
  bounds: {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
  },
};

export class CameraController {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private config: CameraControllerConfig;
  
  private state: CameraState = 'idle';
  private followTarget: Phaser.GameObjects.GameObject | null = null;
  private returnPosition: { x: number; y: number } = { x: 960, y: 540 };
  private currentState: { x: number; y: number; zoom: number } = { x: 960, y: 540, zoom: 1 };
  
  constructor(scene: Phaser.Scene, config?: Partial<CameraControllerConfig>) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    this.setupBounds();
    this.currentState = {
      x: this.camera.scrollX + this.camera.width / 2,
      y: this.camera.scrollY + this.camera.height / 2,
      zoom: this.camera.zoom,
    };
  }
  
  private setupBounds(): void {
    this.camera.setBounds(
      this.config.bounds.x,
      this.config.bounds.y,
      this.config.bounds.width,
      this.config.bounds.height
    );
  }
  
  update(delta: number): void {
    switch (this.state) {
      case 'following':
        this.updateFollowing(delta);
        break;
      case 'returning':
        this.updateReturning(delta);
        break;
      case 'zooming':
        this.updateZooming(delta);
        break;
    }
  }
  
  private updateFollowing(delta: number): void {
    if (!this.followTarget || !this.followTarget.active) {
      this.returnToDefault();
      return;
    }
    
    const target = this.followTarget as Phaser.GameObjects.Sprite;
    const lerpFactor = this.config.followSpeed * (delta / 16.67);
    
    this.currentState.x = Phaser.Math.Linear(this.currentState.x, target.x, lerpFactor);
    this.currentState.y = Phaser.Math.Linear(this.currentState.y, target.y, lerpFactor);
    
    this.camera.scrollX = this.currentState.x - this.camera.width / 2;
    this.camera.scrollY = this.currentState.y - this.camera.height / 2;
  }
  
  private updateReturning(delta: number): void {
    const lerpFactor = this.config.returnSpeed * (delta / 16.67);
    
    this.currentState.x = Phaser.Math.Linear(this.currentState.x, this.returnPosition.x, lerpFactor);
    this.currentState.y = Phaser.Math.Linear(this.currentState.y, this.returnPosition.y, lerpFactor);
    this.currentState.zoom = Phaser.Math.Linear(this.currentState.zoom, this.config.zoomLevels.normal, lerpFactor);
    
    this.camera.scrollX = this.currentState.x - this.camera.width / 2;
    this.camera.scrollY = this.currentState.y - this.camera.height / 2;
    this.camera.setZoom(this.currentState.zoom);
    
    const distX = Math.abs(this.currentState.x - this.returnPosition.x);
    const distY = Math.abs(this.currentState.y - this.returnPosition.y);
    const distZoom = Math.abs(this.currentState.zoom - this.config.zoomLevels.normal);
    
    if (distX < 1 && distY < 1 && distZoom < 0.01) {
      this.state = 'idle';
      this.camera.setZoom(this.config.zoomLevels.normal);
    }
  }
  
  private updateZooming(delta: number): void {
    const lerpFactor = this.config.zoomSpeed * (delta / 16.67);
    
    this.currentState.zoom = Phaser.Math.Linear(
      this.currentState.zoom,
      this.config.zoomLevels.focused,
      lerpFactor
    );
    this.camera.setZoom(this.currentState.zoom);
  }
  
  followProjectile(projectile: Phaser.GameObjects.GameObject): void {
    this.followTarget = projectile;
    this.state = 'following';
  }
  
  followTargetSmooth(target: Phaser.GameObjects.GameObject): void {
    this.followTarget = target;
    this.state = 'following';
  }
  
  returnToDefault(callback?: () => void): void {
    this.followTarget = null;
    this.state = 'returning';
    this.returnPosition = {
      x: this.config.bounds.width / 2,
      y: this.config.bounds.height / 2,
    };
    
    if (callback) {
      const checkReturn = () => {
        if (this.state === 'idle') {
          callback();
        } else {
          this.scene.time.delayedCall(16, checkReturn);
        }
      };
      checkReturn();
    }
  }
  
  returnToPosition(x: number, y: number, callback?: () => void): void {
    this.followTarget = null;
    this.state = 'returning';
    this.returnPosition = { x, y };
    
    if (callback) {
      const checkReturn = () => {
        if (this.state === 'idle') {
          callback();
        } else {
          this.scene.time.delayedCall(16, checkReturn);
        }
      };
      checkReturn();
    }
  }
  
  shake(intensity: CameraShakeIntensity): void {
    const duration = this.config.shakeDurations[intensity];
    const intensityValue = this.config.shakeIntensities[intensity];
    this.camera.shake(duration, intensityValue);
  }
  
  shakeCustom(duration: number, intensity: number): void {
    this.camera.shake(duration, intensity);
  }
  
  zoomTo(level: keyof typeof this.config.zoomLevels, duration: number = 500): void {
    const targetZoom = this.config.zoomLevels[level];
    
    this.scene.tweens.add({
      targets: this.currentState,
      zoom: targetZoom,
      duration,
      ease: 'Power2',
      onUpdate: () => {
        this.camera.setZoom(this.currentState.zoom);
      },
    });
  }
  
  zoomToFit(target: Phaser.GameObjects.GameObject, padding: number = 100): void {
    const sprite = target as Phaser.GameObjects.Sprite;
    if (!sprite || !sprite.active) return;
    
    const bounds = new Phaser.Geom.Rectangle(
      sprite.x - padding,
      sprite.y - padding,
      padding * 2,
      padding * 2
    );
    
    this.camera.zoomTo(
      Math.min(
        this.camera.width / bounds.width,
        this.camera.height / bounds.height
      ),
      500
    );
  }
  
  focusOnTarget(target: Phaser.GameObjects.GameObject, duration: number = 1000): void {
    const sprite = target as Phaser.GameObjects.Sprite;
    if (!sprite || !sprite.active) return;
    
    this.state = 'zooming';
    this.followTarget = target;
    
    this.scene.tweens.add({
      targets: this.currentState,
      x: sprite.x,
      y: sprite.y,
      zoom: this.config.zoomLevels.focused,
      duration,
      ease: 'Power2',
      onUpdate: () => {
        this.camera.scrollX = this.currentState.x - this.camera.width / 2;
        this.camera.scrollY = this.currentState.y - this.camera.height / 2;
        this.camera.setZoom(this.currentState.zoom);
      },
      onComplete: () => {
        this.returnToDefault();
      },
    });
  }
  
  panTo(x: number, y: number, duration: number = 1000): void {
    this.scene.tweens.add({
      targets: this.currentState,
      x,
      y,
      duration,
      ease: 'Power2',
      onUpdate: () => {
        this.camera.scrollX = this.currentState.x - this.camera.width / 2;
        this.camera.scrollY = this.currentState.y - this.camera.height / 2;
      },
    });
  }
  
  shakeForImpact(x: number, y: number, intensity: CameraShakeIntensity = 'medium'): void {
    this.shake(intensity);
  }
  
  cinematicZoom(target: Phaser.GameObjects.GameObject, duration: number = 2000): void {
    const sprite = target as Phaser.GameObjects.Sprite;
    if (!sprite || !sprite.active) return;
    
    this.scene.tweens.add({
      targets: this.currentState,
      x: sprite.x,
      y: sprite.y,
      zoom: this.config.zoomLevels.bossIntro,
      duration: duration / 2,
      ease: 'Power2',
      yoyo: true,
      onUpdate: () => {
        this.camera.scrollX = this.currentState.x - this.camera.width / 2;
        this.camera.scrollY = this.currentState.y - this.camera.height / 2;
        this.camera.setZoom(this.currentState.zoom);
      },
      onComplete: () => {
        this.returnToDefault();
      },
    });
  }
  
  getState(): CameraState {
    return this.state;
  }
  
  getCurrentZoom(): number {
    return this.camera.zoom;
  }
  
  isFollowing(): boolean {
    return this.state === 'following';
  }
  
  reset(): void {
    this.followTarget = null;
    this.state = 'idle';
    this.camera.setZoom(this.config.zoomLevels.normal);
    this.camera.scrollX = 0;
    this.camera.scrollY = 0;
  }
  
  destroy(): void {
    this.followTarget = null;
    this.state = 'idle';
  }
}
