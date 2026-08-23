import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private assetText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingUI();

    this.load.on('progress', (value: number) => {
      const progress = Math.round(value * 100);
      this.progressBar.clear();
      this.progressBar.fillStyle(0x4ade80, 1);
      this.progressBar.fillRect(
        this.cameras.main.width / 2 - 160,
        this.cameras.main.height / 2 - 10,
        320 * value,
        20
      );
      this.percentText.setText(`${progress}%`);
      
      // Emit global loading event
      this.game.events.emit('global-loading-progress', { progress, phase: 'initial' });
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.assetText.setText(`Carregando: ${file.key}`);
      this.game.events.emit('global-loading-file', { file: file.key });
    });

    this.load.on('complete', () => {
      this.loadingText.setText('Pronto!');
      this.assetText.setText('');
      this.game.events.emit('global-loading-complete', { phase: 'initial' });
      this.time.delayedCall(300, () => {
        this.scene.start('BattleScene');
      });
    });

    this.loadAssets();
  }

  private createLoadingUI(): void {
    const { width, height } = this.cameras.main;

    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x1e293b, 0.9);
    this.progressBox.fillRoundedRect(width / 2 - 170, height / 2 - 50, 340, 100, 12);

    this.progressBar = this.add.graphics();

    this.loadingText = this.add.text(width / 2, height / 2 - 70, 'Preparando arena...', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: '#f8fafc',
    }).setOrigin(0.5);

    this.percentText = this.add.text(width / 2, height / 2 - 15, '0%', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '18px',
      color: '#4ade80',
    }).setOrigin(0.5);

    this.assetText = this.add.text(width / 2, height / 2 + 25, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setOrigin(0.5);
  }

  private loadAssets(): void {
    this.load.setPath('/');

    this.load.image('bg_arena_1', 'maps/arena_1_bg.svg');
    this.load.image('bg_arena_2', 'maps/arena_2_bg.svg');
    this.load.image('bg_arena_3', 'maps/arena_3_bg.svg');
    this.load.image('bg_arena_4', 'maps/arena_4_bg.svg');
    this.load.image('bg_arena_5', 'maps/arena_5_bg.svg');
    this.load.image('bg_arena_6', 'maps/arena_6_bg.svg');
    this.load.image('bg_arena_7', 'maps/arena_7_bg.svg');
    this.load.image('bg_arena_8', 'maps/arena_8_bg.svg');
    this.load.image('bg_arena_9', 'maps/arena_9_bg.svg');
    this.load.image('bg_arena_10', 'maps/arena_10_bg.svg');
    this.load.image('bg_arena_11', 'maps/arena_11_bg.svg');
    this.load.image('bg_arena_12', 'maps/arena_12_bg.svg');
    this.load.image('bg_arena_13', 'maps/arena_13_bg.svg');
    this.load.image('bg_arena_14', 'maps/arena_14_bg.svg');
    this.load.image('bg_arena_15', 'maps/arena_15_bg.svg');
    this.load.image('bg_arena_16', 'maps/arena_16_bg.svg');
    this.load.image('bg_arena_17', 'maps/arena_17_bg.svg');
    this.load.image('bg_arena_18', 'maps/arena_18_bg.svg');
    this.load.image('bg_arena_19', 'maps/arena_19_bg.svg');
    this.load.image('bg_arena_20', 'maps/arena_20_bg.svg');
    this.load.image('bg_arena_21', 'maps/arena_21_bg.svg');
    this.load.image('bg_arena_22', 'maps/arena_22_bg.svg');
    this.load.image('bg_arena_23', 'maps/arena_23_bg.svg');
    this.load.image('bg_arena_24', 'maps/arena_24_bg.svg');
    this.load.image('bg_boss_1', 'maps/boss_1_bg.svg');
    this.load.image('bg_boss_2', 'maps/boss_2_bg.svg');
    this.load.image('bg_boss_3', 'maps/boss_3_bg.svg');
    this.load.image('bg_boss_4', 'maps/boss_4_bg.svg');
    this.load.image('bg_boss_5', 'maps/boss_5_bg.svg');
    this.load.image('bg_boss_6', 'maps/boss_6_bg.svg');

    this.load.image('world_bg_sky', 'maps/world_sky.svg');
    this.load.image('world_bg_mountains', 'maps/world_mountains.svg');
    this.load.image('world_bg_trees', 'maps/world_trees.svg');
    this.load.image('world_bg_crystals', 'maps/world_crystals.svg');

    this.load.image('char_kai', 'characters/kai.svg');
    this.load.image('char_luna', 'characters/luna.svg');
    this.load.image('char_bolt', 'characters/bolt.svg');
    this.load.image('char_nova', 'characters/nova.svg');
    this.load.image('char_zephyr', 'characters/zephyr.svg');
    this.load.image('char_igneous', 'characters/igneous.svg');
    this.load.image('char_glacis', 'characters/glacis.svg');
    this.load.image('char_aeris', 'characters/aeris.svg');

    this.load.image('avatar_kai', 'characters/avatar_kai.svg');
    this.load.image('avatar_luna', 'characters/avatar_luna.svg');
    this.load.image('avatar_bolt', 'characters/avatar_bolt.svg');
    this.load.image('avatar_nova', 'characters/avatar_nova.svg');
    this.load.image('avatar_zephyr', 'characters/avatar_zephyr.svg');
    this.load.image('avatar_igneous', 'characters/avatar_igneous.svg');
    this.load.image('avatar_glacis', 'characters/avatar_glacis.svg');
    this.load.image('avatar_aeris', 'characters/avatar_aeris.svg');

    this.load.aseprite('char_zephyr', 'characters/spritesheets/zephyr.png', 'characters/spritesheets/zephyr.json');
    this.load.aseprite('char_igneous', 'characters/spritesheets/igneous.png', 'characters/spritesheets/igneous.json');

    this.load.image('projectile', 'effects/projectile.svg');
    this.load.image('projectile_heavy', 'effects/projectile_heavy.svg');
    this.load.image('projectile_cluster', 'effects/projectile_cluster.svg');
    this.load.image('projectile_piercing', 'effects/projectile_piercing.svg');
    this.load.image('projectile_fire', 'effects/projectile_fire.svg');
    this.load.image('projectile_ice', 'effects/projectile_ice.svg');
    this.load.image('projectile_electric', 'effects/projectile_electric.svg');
    this.load.image('projectile_bounce', 'effects/projectile_bounce.svg');
    this.load.image('projectile_multi', 'effects/projectile_multi.svg');
    this.load.image('projectile_tactical', 'effects/projectile_tactical.svg');
    this.load.image('explosion', 'effects/explosion.svg');
    this.load.image('explosion_heavy', 'effects/explosion_heavy.svg');
    this.load.image('explosion_cluster', 'effects/explosion_cluster.svg');
    this.load.image('explosion_fire', 'effects/explosion_fire.svg');
    this.load.image('explosion_ice', 'effects/explosion_ice.svg');
    this.load.image('explosion_electric', 'effects/explosion_electric.svg');
    this.load.image('particle_smoke', 'effects/smoke.svg');
    this.load.image('particle_spark', 'effects/spark.svg');
    this.load.image('particle_star', 'effects/star.svg');
    this.load.image('particle_leaf', 'effects/leaf.svg');

    this.load.image('node_locked', 'ui/node_locked.svg');
    this.load.image('node_available', 'ui/node_available.svg');
    this.load.image('node_completed', 'ui/node_completed.svg');
    this.load.image('node_perfect', 'ui/node_perfect.svg');
    this.load.image('node_boss', 'ui/node_boss.svg');
    this.load.image('node_boss_completed', 'ui/node_boss_completed.svg');
    this.load.image('node_boss_perfect', 'ui/node_boss_perfect.svg');
    this.load.image('ui_panel', 'ui/panel.svg');

    this.load.audio('bgm_menu', 'audio/bgm_menu.ogg');
    this.load.audio('bgm_battle', 'audio/bgm_battle.ogg');
    this.load.audio('bgm_green_valley', 'audio/bgm_green_valley.ogg');
    this.load.audio('bgm_crystal_desert', 'audio/bgm_crystal_desert.ogg');
    this.load.audio('bgm_frozen_peaks', 'audio/bgm_frozen_peaks.ogg');
    this.load.audio('bgm_ember_lands', 'audio/bgm_ember_lands.ogg');
    this.load.audio('bgm_sky_kingdom', 'audio/bgm_sky_kingdom.ogg');
    this.load.audio('bgm_dark_citadel', 'audio/bgm_dark_citadel.ogg');
    this.load.audio('bgm_boss', 'audio/bgm_boss.ogg');
    this.load.audio('sfx_shot', 'audio/sfx_shot.ogg');
    this.load.audio('sfx_shot_heavy', 'audio/sfx_shot_heavy.ogg');
    this.load.audio('sfx_shot_cluster', 'audio/sfx_shot_cluster.ogg');
    this.load.audio('sfx_shot_piercing', 'audio/sfx_shot_piercing.ogg');
    this.load.audio('sfx_shot_fire', 'audio/sfx_shot_fire.ogg');
    this.load.audio('sfx_shot_ice', 'audio/sfx_shot_ice.ogg');
    this.load.audio('sfx_shot_electric', 'audio/sfx_shot_electric.ogg');
    this.load.audio('sfx_shot_bounce', 'audio/sfx_shot_bounce.ogg');
    this.load.audio('sfx_shot_multi', 'audio/sfx_shot_multi.ogg');
    this.load.audio('sfx_shot_tactical', 'audio/sfx_shot_tactical.ogg');
    this.load.audio('sfx_explosion', 'audio/sfx_explosion.ogg');
    this.load.audio('sfx_explosion_heavy', 'audio/sfx_explosion_heavy.ogg');
    this.load.audio('sfx_explosion_cluster', 'audio/sfx_explosion_cluster.ogg');
    this.load.audio('sfx_explosion_fire', 'audio/sfx_explosion_fire.ogg');
    this.load.audio('sfx_explosion_ice', 'audio/sfx_explosion_ice.ogg');
    this.load.audio('sfx_explosion_electric', 'audio/sfx_explosion_electric.ogg');
    this.load.audio('sfx_hit', 'audio/sfx_hit.ogg');
    this.load.audio('sfx_wind', 'audio/sfx_wind.ogg');
    this.load.audio('sfx_ui_click', 'audio/sfx_ui_click.ogg');
    this.load.audio('sfx_power_charge', 'audio/sfx_power_charge.ogg');
    this.load.audio('sfx_ability', 'audio/sfx_ability.ogg');
    this.load.audio('sfx_unlock', 'audio/sfx_unlock.ogg');
  }

  create(): void {
  }
}