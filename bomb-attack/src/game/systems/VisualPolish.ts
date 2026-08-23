import * as Phaser from 'phaser';

export type ParticleEffect = 'wind' | 'dust' | 'sparkles' | 'rain' | 'snow' | 'fire' | 'smoke' | 'confetti' | 'stars' | 'leaves';

export interface ParticleConfig {
  texture: string;
  quantity: number;
  lifespan: number;
  speed: { min: number; max: number };
  scale: { start: number; end: number };
  alpha: { start: number; end: number };
  angle: { min: number; max: number };
  gravityY: number;
  frequency: number;
  blendMode: Phaser.BlendModes;
  tint?: number[];
}

const PARTICLE_CONFIGS: Record<ParticleEffect, ParticleConfig> = {
  wind: {
    texture: 'particle',
    quantity: 5,
    lifespan: 3000,
    speed: { min: 50, max: 150 },
    scale: { start: 0.3, end: 0.1 },
    alpha: { start: 0.4, end: 0 },
    angle: { min: 0, max: 30 },
    gravityY: 0,
    frequency: 500,
    blendMode: Phaser.BlendModes.ADD,
    tint: [0xffffff, 0xcccccc],
  },
  dust: {
    texture: 'particle',
    quantity: 8,
    lifespan: 2000,
    speed: { min: 20, max: 60 },
    scale: { start: 0.2, end: 0.05 },
    alpha: { start: 0.5, end: 0 },
    angle: { min: 150, max: 210 },
    gravityY: -10,
    frequency: 400,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0xd4a574, 0xc49a6c],
  },
  sparkles: {
    texture: 'particle',
    quantity: 10,
    lifespan: 1000,
    speed: { min: 50, max: 150 },
    scale: { start: 0.4, end: 0 },
    alpha: { start: 1, end: 0 },
    angle: { min: 0, max: 360 },
    gravityY: 50,
    frequency: 300,
    blendMode: Phaser.BlendModes.ADD,
    tint: [0xfbbf24, 0xf59e0b, 0xeab308],
  },
  rain: {
    texture: 'particle',
    quantity: 20,
    lifespan: 1500,
    speed: { min: 200, max: 400 },
    scale: { start: 0.1, end: 0.05 },
    alpha: { start: 0.6, end: 0.2 },
    angle: { min: 80, max: 100 },
    gravityY: 100,
    frequency: 50,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0x60a5fa, 0x93c5fd],
  },
  snow: {
    texture: 'particle',
    quantity: 15,
    lifespan: 4000,
    speed: { min: 20, max: 80 },
    scale: { start: 0.3, end: 0.1 },
    alpha: { start: 0.8, end: 0.3 },
    angle: { min: 0, max: 360 },
    gravityY: 20,
    frequency: 100,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0xffffff, 0xe2e8f0],
  },
  fire: {
    texture: 'particle',
    quantity: 12,
    lifespan: 800,
    speed: { min: 50, max: 150 },
    scale: { start: 0.5, end: 0.1 },
    alpha: { start: 0.8, end: 0 },
    angle: { min: 250, max: 290 },
    gravityY: -100,
    frequency: 100,
    blendMode: Phaser.BlendModes.ADD,
    tint: [0xf97316, 0xef4444, 0xfbbf24],
  },
  smoke: {
    texture: 'particle',
    quantity: 8,
    lifespan: 2000,
    speed: { min: 30, max: 80 },
    scale: { start: 0.2, end: 0.6 },
    alpha: { start: 0.5, end: 0 },
    angle: { min: 250, max: 290 },
    gravityY: -30,
    frequency: 200,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0x64748b, 0x475569],
  },
  confetti: {
    texture: 'particle',
    quantity: 30,
    lifespan: 3000,
    speed: { min: 100, max: 300 },
    scale: { start: 0.4, end: 0.2 },
    alpha: { start: 1, end: 0.5 },
    angle: { min: 0, max: 360 },
    gravityY: 200,
    frequency: 50,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0xf87171, 0x4ade80, 0x60a5fa, 0xfbbf24, 0xc084fc],
  },
  stars: {
    texture: 'particle',
    quantity: 15,
    lifespan: 2000,
    speed: { min: 30, max: 100 },
    scale: { start: 0.3, end: 0 },
    alpha: { start: 0.8, end: 0 },
    angle: { min: 0, max: 360 },
    gravityY: 0,
    frequency: 150,
    blendMode: Phaser.BlendModes.ADD,
    tint: [0xfbbf24, 0xf59e0b],
  },
  leaves: {
    texture: 'particle',
    quantity: 8,
    lifespan: 3000,
    speed: { min: 40, max: 120 },
    scale: { start: 0.3, end: 0.15 },
    alpha: { start: 0.7, end: 0.3 },
    angle: { min: 0, max: 360 },
    gravityY: 30,
    frequency: 300,
    blendMode: Phaser.BlendModes.NORMAL,
    tint: [0x4ade80, 0x22c55e, 0x16a34a],
  },
};

export class VisualPolish {
  private scene: Phaser.Scene;
  private activeEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  
  createParticleEffect(
    effect: ParticleEffect,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    const config = PARTICLE_CONFIGS[effect];
    
    const emitter = this.scene.add.particles(x, y, config.texture, {
      quantity: config.quantity,
      lifespan: config.lifespan,
      speed: config.speed,
      scale: config.scale,
      alpha: config.alpha,
      angle: config.angle,
      gravityY: config.gravityY,
      frequency: config.frequency,
      blendMode: config.blendMode,
      tint: config.tint,
    });
    
    this.activeEmitters.push(emitter);
    return emitter;
  }
  
  createAmbientEffect(effect: ParticleEffect): Phaser.GameObjects.Particles.ParticleEmitter {
    const cam = this.scene.cameras.main;
    return this.createParticleEffect(effect, cam.width / 2, -50, cam.width + 200, 100);
  }
  
  createExplosionEffect(x: number, y: number): void {
    this.createParticleEffect('fire', x, y, 100, 100);
    this.createParticleEffect('smoke', x, y, 150, 150);
    this.createParticleEffect('sparkles', x, y, 200, 200);
  }
  
  createHitEffect(x: number, y: number, isCritical: boolean = false): void {
    this.createParticleEffect('sparkles', x, y, isCritical ? 150 : 80, isCritical ? 150 : 80);
  }
  
  createVictoryEffect(): void {
    const cam = this.scene.cameras.main;
    this.createParticleEffect('confetti', cam.width / 2, -50, cam.width, 100);
    this.createParticleEffect('stars', cam.width / 2, cam.height / 2, cam.width, cam.height);
  }
  
  createMenuBackground(): void {
    this.createParticleEffect('sparkles', 200, 300, 400, 600);
    this.createParticleEffect('stars', 800, 200, 400, 400);
  }
  
  stopAll(): void {
    this.activeEmitters.forEach(emitter => {
      if (emitter.active) {
        emitter.stop();
      }
    });
  }
  
  clearAll(): void {
    this.activeEmitters.forEach(emitter => {
      if (emitter.active) {
        emitter.destroy();
      }
    });
    this.activeEmitters = [];
  }
  
  destroy(): void {
    this.clearAll();
  }
}

export interface GlowConfig {
  color: number;
  intensity: number;
  blur: number;
  spread: number;
}

const GLOW_CONFIGS: Record<string, GlowConfig> = {
  primary: { color: 0x4ade80, intensity: 0.8, blur: 8, spread: 4 },
  secondary: { color: 0x60a5fa, intensity: 0.7, blur: 6, spread: 3 },
  danger: { color: 0xef4444, intensity: 0.8, blur: 8, spread: 4 },
  warning: { color: 0xfbbf24, intensity: 0.7, blur: 6, spread: 3 },
  success: { color: 0x22c55e, intensity: 0.8, blur: 8, spread: 4 },
  info: { color: 0x60a5fa, intensity: 0.7, blur: 6, spread: 3 },
};

export function addGlowToElement(
  element: Phaser.GameObjects.Shape,
  glowType: keyof typeof GLOW_CONFIGS = 'primary'
): void {
  const config = GLOW_CONFIGS[glowType];
  
  element.setStrokeStyle(config.spread, config.color, config.intensity);
}

export function pulseGlow(
  element: Phaser.GameObjects.Shape,
  glowType: keyof typeof GLOW_CONFIGS = 'primary',
  scene: Phaser.Scene
): void {
  const config = GLOW_CONFIGS[glowType];
  
  scene.tweens.add({
    targets: element,
    alpha: 0.6,
    duration: 500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
}

export default VisualPolish;
