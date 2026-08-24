import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // No assets loaded here; PreloadScene handles all loading.
  }

  create(): void {
    this.scale.scaleMode = Phaser.Scale.FIT;
    this.scale.autoCenter = Phaser.Scale.CENTER_BOTH;

    this.physics.world.setFPS(60);
    this.physics.world.gravity.y = 980;

    this.scene.start('PreloadScene');
  }
}