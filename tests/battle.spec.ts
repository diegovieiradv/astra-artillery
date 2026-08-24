import { test, expect } from '@playwright/test';

test.describe('Fluxo Principal do Jogo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Home carrega e exibe logo + botão START', async ({ page }) => {
    await expect(page.locator('h1:has-text("ASTRA ARTILLERY")')).toBeVisible();
    await expect(page.locator('button:has-text("INICIAR")')).toBeVisible();
  });

  test('Clicar START navega para seleção de personagem', async ({ page }) => {
    await page.click('button:has-text("INICIAR")');
    await expect(page).toHaveURL(/\/characters/, { timeout: 15000 });
    await expect(page.locator('h1:has-text("ESCOLHA SEU AVENTUREIRO")')).toBeVisible({ timeout: 10000 });
  });

  test('Seleção de personagem mostra 8 cards', async ({ page }) => {
    await page.goto('/characters');
    const cards = page.locator('article[role="listitem"]');
    await expect(cards).toHaveCount(8, { timeout: 10000 });
  });

  test('Selecionar personagem habilita botão CONFIRMAR', async ({ page }) => {
    await page.goto('/characters');
    await page.click('[role="listitem"]:first-child');
    await expect(page.locator('button:has-text("CONFIRMAR"):not([disabled])')).toBeVisible({ timeout: 10000 });
  });

  test('Confirmar personagem navega para mapa', async ({ page }) => {
    await page.goto('/characters');
    await page.click('[role="listitem"]:first-child');
    await page.click('button:has-text("CONFIRMAR")');
    // Use domcontentloaded instead of load for faster navigation detection
    await page.waitForURL(/\/map/, { timeout: 25000, waitUntil: 'domcontentloaded' });
  });

  test('Mapa mostra GREEN VALLEY e fases', async ({ page }) => {
    // Set up character selection in localStorage BEFORE any navigation
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('astra-artillery-save', JSON.stringify({
        version: 2,
        selectedCharacterId: 'kai',
        unlockedLevels: ['arena_1'],
        completedLevels: {},
        settings: { musicVolume: 0.5, sfxVolume: 0.7, musicEnabled: true, sfxEnabled: true, reduceMotion: false, showDamageNumbers: true, vibrationEnabled: true },
        tutorialCompleted: false,
        currentLevelId: null,
        totalPlayTime: 0,
        currency: 0,
        unlockedCharacters: [],
        ownedCosmetics: [],
        equippedCosmetics: {},
        upgrades: { cannon: { level: 1, stats: {} }, armor: { level: 1, stats: {} }, mobility: { level: 1, stats: {} }, special: { level: 1, stats: {} } },
        statistics: { totalWins: 0, totalLosses: 0, totalDamageDealt: 0, totalDamageReceived: 0, specialsUsed: 0, perfectWins: 0 }
      }));
    });
    
    await page.reload({ waitUntil: 'networkidle' });
    await page.goto('/map', { waitUntil: 'networkidle' });
    // Wait for Phaser canvas to be ready and header to be visible with extended timeout
    await page.waitForSelector('h1:has-text("GREEN VALLEY")', { timeout: 60000 });
    await expect(page.locator('h2:has-text("Planícies de Aether")')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Configurações', () => {
  test('Página de configurações carrega', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1:has-text("CONFIGURAÇÕES")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Áudio")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Jogabilidade")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Efeitos Visuais")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Acessibilidade")')).toBeVisible({ timeout: 10000 });
  });

  test('Página de configurações tem seção de áudio', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h2:has-text("Áudio")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('span:has-text("Música")').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Sobre', () => {
  test('Página sobre carrega com créditos', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1:has-text("SOBRE")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Créditos")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Tecnologias")')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Oficina (Workshop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('astra-artillery-save', JSON.stringify({
        version: 2,
        selectedCharacterId: 'kai',
        unlockedLevels: ['arena_1'],
        completedLevels: {},
        settings: { musicVolume: 0.5, sfxVolume: 0.7, musicEnabled: true, sfxEnabled: true, reduceMotion: false, showDamageNumbers: true, vibrationEnabled: true },
        tutorialCompleted: false,
        currentLevelId: null,
        totalPlayTime: 0,
        currency: 500,
        unlockedCharacters: ['kai', 'nova', 'bolt'],
        ownedCosmetics: ['trail_blue'],
        equippedCosmetics: {},
        upgrades: { cannon: { level: 1, stats: {} }, armor: { level: 1, stats: {} }, mobility: { level: 1, stats: {} }, special: { level: 1, stats: {} } },
        statistics: { totalWins: 0, totalLosses: 0, totalDamageDealt: 0, totalDamageReceived: 0, specialsUsed: 0, perfectWins: 0 }
      }));
    });
  });

  test('Página da oficina carrega com título e tabs', async ({ page }) => {
    await page.goto('/workshop');
    await expect(page.locator('h1:has-text("OFICINA")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('nav[role="tablist"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Canhão")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Armadura")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Mobilidade")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Especial")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Cosméticos")')).toBeVisible({ timeout: 10000 });
  });

  test('Tab Canhão mostra painel de upgrade com nível atual', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Canhão")');
    await expect(page.locator('[role="tabpanel"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nível atual: 1')).toBeVisible({ timeout: 10000 });
  });

  test('Tab Armadura mostra painel de upgrade', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Armadura")');
    await expect(page.locator('[role="tabpanel"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nível atual: 1')).toBeVisible({ timeout: 10000 });
  });

  test('Tab Mobilidade mostra painel de upgrade', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Mobilidade")');
    await expect(page.locator('[role="tabpanel"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nível atual: 1')).toBeVisible({ timeout: 10000 });
  });

  test('Tab Especial mostra painel de upgrade', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Especial")');
    await expect(page.locator('[role="tabpanel"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nível atual: 1')).toBeVisible({ timeout: 10000 });
  });

  test('Tab Cosméticos mostra grid de itens', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Cosméticos")');
    await expect(page.locator('[role="tabpanel"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Trilho de Tiro')).toBeVisible({ timeout: 10000 });
  });

  test('Saldo de Astra Credits é exibido', async ({ page }) => {
    await page.goto('/workshop');
    await expect(page.locator('[aria-label*="Saldo"]')).toContainText('500', { timeout: 10000 });
  });

  test('Botão de upgrade está habilitado com saldo suficiente', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('button:has-text("Canhão")');
    const upgradeBtn = page.locator('button:has-text("MELHORAR")');
    await expect(upgradeBtn).toBeVisible({ timeout: 10000 });
    await expect(upgradeBtn).not.toBeDisabled();
  });

  test('Voltar do workshop navega para home', async ({ page }) => {
    await page.goto('/workshop');
    await page.click('[aria-label="Voltar"]');
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('Golden Path - Mapa → Fase → Recompensa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('astra-artillery-save', JSON.stringify({
        version: 2,
        selectedCharacterId: 'kai',
        unlockedLevels: ['arena_1', 'arena_2'],
        completedLevels: {},
        settings: { musicVolume: 0.5, sfxVolume: 0.7, musicEnabled: true, sfxEnabled: true, reduceMotion: false, showDamageNumbers: true, vibrationEnabled: true },
        tutorialCompleted: true,
        currentLevelId: null,
        totalPlayTime: 0,
        currency: 100,
        unlockedCharacters: ['kai', 'nova'],
        ownedCosmetics: [],
        equippedCosmetics: {},
        upgrades: { cannon: { level: 1, stats: {} }, armor: { level: 1, stats: {} }, mobility: { level: 1, stats: {} }, special: { level: 1, stats: {} } },
        statistics: { totalWins: 0, totalLosses: 0, totalDamageDealt: 0, totalDamageReceived: 0, specialsUsed: 0, perfectWins: 0 }
      }));
    });
  });

  test('Mapa mostra fases desbloqueadas', async ({ page }) => {
    await page.goto('/map', { waitUntil: 'networkidle' });
    await page.waitForSelector('h1:has-text("GREEN VALLEY")', { timeout: 60000 });
    await expect(page.locator('h2:has-text("Planícies de Aether")')).toBeVisible({ timeout: 10000 });
  });

  test('Clicar fase desbloqueada navega para jogo', async ({ page }) => {
    await page.goto('/map', { waitUntil: 'networkidle' });
    await page.waitForSelector('h1:has-text("GREEN VALLEY")', { timeout: 60000 });
    await page.click('text=Planícies de Aether', { timeout: 10000 });
    await page.waitForURL(/\/game/, { timeout: 25000 });
  });

  test('Página de perfil mostra estatísticas do jogador', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('h1:has-text("PERFIL")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vitórias')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Derrotas')).toBeVisible({ timeout: 10000 });
  });
});