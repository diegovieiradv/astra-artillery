# Changelog

All notable changes to Astra Artillery will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-08-24

### Added
- **Pause System**: ESC/P key toggles pause overlay with resume/quit options
- **Audio Crossfade**: BGM tracks now crossfade smoothly between scenes (1s fade)
- **Fullscreen Toggle**: Button in battle HUD for cross-browser fullscreen support
- **Gamepad Support**: Connected controllers map to battle controls (d-pad + face buttons)
- **Contextual Feedback**: Perfect shot, long shot, critical hit, combo, and more
- **Reward Animations**: Battle results show animated stars, XP bar, and coin counter
- **Impact Effects**: Particle-based explosions with shockwaves and screen flash
- **Camera System**: Projectile follow, shake (4 intensities), zoom, cinematic modes

### Changed
- Battle HUD now includes fullscreen and weather indicators
- Music volume ducks to 30% during pause
- Game loop skips updates while paused

## [0.1.0] - 2026-08-23

### Added
- 30-level campaign across 6 regions with 6 boss battles
- 10 playable characters with unique abilities
- 10 projectile types with distinct physics
- 5 tactical items (shield, heal, EMP, teleport, time-slow)
- Workshop system for character upgrades and cosmetics
- Training mode with 6 exercise types
- Mission system with progress tracking and rewards
- Arsenal with projectile and tactical item encyclopedia
- How-to-Play interactive tutorial (10 steps)
- Save system with export/import and versioned schema
- Navigation menu for all game pages
- Weather system (7 types) with battle effects
- Loading integration with route-change detection
- World map with region-based level selection
- Player profile with statistics and progression
- Settings with audio, visual, and accessibility options
- 404 page with navigation links
- Error boundary with fallback UI
- PWA manifest and service worker
- i18n support (pt-BR, en-US, es-ES)
