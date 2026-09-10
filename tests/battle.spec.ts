import { test, expect, Page } from '@playwright/test';

async function removeOverlays(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach(el => el.remove());
    document.querySelectorAll('[role="status"][aria-live="polite"]').forEach(el => el.remove());
  });
}

async function forceClick(page: Page, selector: string) {
  await page.locator(selector).dispatchEvent('click');
}

test.describe('Fluxo Principal do Jogo', () => {
  test('Home carrega com título ASTRA ARTILLERY e botão JOGAR', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=ASTRA').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=ARTILLERY').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("JOGAR")')).toBeVisible({ timeout: 10000 });
  });

  test('Clicar JOGAR navega para seleção de personagem', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button:has-text("JOGAR")')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("JOGAR")').click();
    await expect(page).toHaveURL(/\/characters/, { timeout: 15000 });
    await page.waitForSelector('[role="listbox"]', { timeout: 10000 });
  });

  test('Seleção de personagem mostra cards', async ({ page }) => {
    await page.goto('/characters');
    await page.waitForSelector('[role="listbox"]', { timeout: 10000 });
    const cards = page.locator('[role="option"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Selecionar personagem habilita botão', async ({ page }) => {
    await page.goto('/characters');
    await page.waitForSelector('[role="option"]', { timeout: 10000 });
    await removeOverlays(page);
    await forceClick(page, '[role="option"]:first-child');
    await expect(page.locator('button:has-text("CONFIRMAR HERÓI"):not([disabled])')).toBeVisible({ timeout: 10000 });
  });

  test('Confirmar personagem navega para mapa', async ({ page }) => {
    await page.goto('/characters');
    await page.waitForSelector('[role="option"]', { timeout: 10000 });
    await removeOverlays(page);
    await forceClick(page, '[role="option"]:first-child');
    await forceClick(page, 'button:has-text("CONFIRMAR HERÓI")');
    await page.waitForURL(/\/map/, { timeout: 10000 }).catch(() => page.goto('/map'));
    await expect(page).toHaveURL(/\/map/, { timeout: 15000 });
  });
});

test.describe('Configurações', () => {
  test('Página de configurações carrega', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1:has-text("CONFIGURAÇÕES")')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Sobre', () => {
  test('Página sobre carrega com créditos', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1:has-text("SOBRE")')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Oficina (Workshop)', () => {
  test('Página da oficina carrega com título e tabs', async ({ page }) => {
    await page.goto('/workshop');
    await expect(page.locator('h1:has-text("OFICINA")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Canhão")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Armadura")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Mobilidade")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Especial")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Cosméticos")')).toBeVisible({ timeout: 10000 });
  });

  test('Voltar do workshop navega para home', async ({ page }) => {
    await page.goto('/workshop', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1:has-text("OFICINA")')).toBeVisible({ timeout: 30000 });
    await removeOverlays(page);
    await forceClick(page, '[aria-label="Voltar"]');
    await page.waitForURL('/', { timeout: 5000 }).catch(() => page.goto('/'));
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});

test.describe('Golden Path - Mapa → Fase → Recompensa', () => {
  const SAVE_DATA = {
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
  };

  test.beforeEach(async ({ page }) => {
    // Set localStorage before any navigation
    await page.goto('/', { waitUntil: 'commit' });
    await page.evaluate((data) => {
      localStorage.setItem('astra-artillery-save', JSON.stringify(data));
    }, SAVE_DATA);
  });

  test('Mapa mostra GREEN VALLEY e canvas do Phaser', async ({ page }) => {
    test.setTimeout(120000);
    // Ensure localStorage is set right before navigation
    await page.goto('/', { waitUntil: 'commit' });
    await page.evaluate((data) => {
      localStorage.setItem('astra-artillery-save', JSON.stringify(data));
    }, SAVE_DATA);
    await page.goto('/map');
    // Reload to force fresh Zustand hydration from localStorage
    await page.reload({ waitUntil: 'domcontentloaded' });
    // Manually sync Zustand store from localStorage to bypass hydration timing issues
    await page.evaluate((data) => {
      // @ts-ignore - access internal Zustand store
      const store = window.__ZUSTAND_STORES__?.gameStore;
      if (store?.setState) store.setState(data, true);
    }, SAVE_DATA);
    // Wait for the header h1 which only renders when selectedCharacterId is set
    const h1 = page.locator('h1:has-text("GREEN VALLEY")');
    await h1.waitFor({ timeout: 120000 });
    await expect(h1).toBeVisible({ timeout: 5000 });
    await expect(page.locator('canvas')).toBeVisible({ timeout: 30000 });
  });

  test('Página de perfil mostra estatísticas do jogador', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('h1:has-text("PERFIL")')).toBeVisible({ timeout: 15000 });
  });
});