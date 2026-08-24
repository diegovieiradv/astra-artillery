export type Locale = 'pt-BR' | 'en-US' | 'es-ES';

export interface TranslationKeys {
  common: {
    play: string;
    settings: string;
    back: string;
    continue: string;
    cancel: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
    close: string;
    save: string;
    delete: string;
    next: string;
    previous: string;
    level: string;
    max: string;
    equipped: string;
    locked: string;
    completed: string;
    credits: string;
    xp: string;
    closeMenu: string;
    openMenu: string;
  };
  nav: {
    home: string;
    map: string;
    characters: string;
    workshop: string;
    arsenal: string;
    training: string;
    missions: string;
    profile: string;
    howToPlay: string;
    settings: string;
  };
  home: {
    subtitle: string;
    continueGame: string;
    newGame: string;
    version: string;
    footer: string;
    footerTech: string;
  };
  menu: {
    title: string;
    newGame: string;
    continueGame: string;
    settings: string;
    characters: string;
    workshop: string;
    profile: string;
  };
  battle: {
    start: string;
    victory: string;
    defeat: string;
    turn: string;
    health: string;
    attack: string;
    defense: string;
    wind: string;
    angle: string;
    you: string;
    enemy: string;
    turns: string;
    yourDamage: string;
    enemyDamage: string;
    nextPhase: string;
    changeCharacter: string;
    preparingArena: string;
    rotateDevice: string;
    rotateHint: string;
    pauseTitle: string;
    pauseHint: string;
    resume: string;
    quitBattle: string;
    fullscreen: string;
    exitFullscreen: string;
    controlsHint: string;
  };
  settings: {
    title: string;
    audio: string;
    gameplay: string;
    visualEffects: string;
    accessibility: string;
    data: string;
    music: string;
    musicVolume: string;
    musicDesc: string;
    sfx: string;
    sfxVolume: string;
    sfxDesc: string;
    reduceAnimations: string;
    reduceAnimationsDesc: string;
    showDamageNumbers: string;
    showDamageNumbersDesc: string;
    vibration: string;
    vibrationDesc: string;
    screenShake: string;
    screenShakeDesc: string;
    screenFlash: string;
    screenFlashDesc: string;
    particles: string;
    particlesDesc: string;
    highContrast: string;
    highContrastDesc: string;
    largeText: string;
    largeTextDesc: string;
    screenReader: string;
    screenReaderDesc: string;
    exportSave: string;
    importSave: string;
    clearSave: string;
    resetProgress: string;
    exportDesc: string;
    importDesc: string;
    clearSaveDesc: string;
    resetProgressDesc: string;
    saveCopied: string;
    noSaveFound: string;
    exportError: string;
    saveImported: string;
    invalidJson: string;
    saveCleared: string;
    confirmClear: string;
    confirmReset: string;
    pasteJson: string;
  };
  characters: {
    title: string;
    loading: string;
    health: string;
    attack: string;
    defense: string;
    mobility: string;
    specialAbility: string;
    cooldown: string;
    confirm: string;
    readyForBattle: string;
    selectCharacter: string;
    turns: string;
  };
  workshop: {
    title: string;
    loading: string;
    cannon: string;
    armor: string;
    mobility: string;
    special: string;
    cosmetics: string;
    balance: string;
    confirmPurchase: string;
    cancel: string;
    buy: string;
    insufficientFunds: string;
    upgraded: string;
    upgradeFailed: string;
    unlockedEquipped: string;
    removed: string;
    equipped: string;
    level: string;
    maxLevel: string;
    maxLevelReached: string;
    upgrade: string;
    cosmeticsHint: string;
  };
  arsenal: {
    title: string;
    loading: string;
    projectiles: string;
    tacticalItems: string;
    count: string;
    default: string;
    stats: {
      damage: string;
      radius: string;
      speed: string;
      wind: string;
      gravity: string;
      mass: string;
    };
    charges: string;
    price: string;
    effects: string;
    unlock: string;
    behaviors: {
      balanced: string;
      heavy: string;
      cluster: string;
      piercing: string;
      incendiary: string;
      freezing: string;
      electric: string;
      ricochet: string;
      multi: string;
      tactical: string;
    };
    rarities: {
      common: string;
      rare: string;
      epic: string;
      legendary: string;
    };
  };
  training: {
    title: string;
    loading: string;
    subtitle: string;
    all: string;
    objectives: string;
    rewards: string;
    startTraining: string;
    completed: string;
    locked: string;
    requiredLevel: string;
    credits: string;
    mastery: string;
  };
  missions: {
    title: string;
    loading: string;
    all: string;
    claim: string;
    credits: string;
    xp: string;
    lore: string;
    cosmetic: string;
    locked: string;
    objectives: string;
    rewards: string;
    claimRewards: string;
  };
  profile: {
    title: string;
    loading: string;
    level: string;
    commander: string;
    favoriteCharacter: string;
    mastery: string;
    nextReward: string;
    maxLevel: string;
    statsTitle: string;
    victories: string;
    defeats: string;
    accuracy: string;
    battles: string;
    stars: string;
    bosses: string;
    damageDealt: string;
    damageReceived: string;
    specials: string;
    perfectWins: string;
    campaignProgress: string;
    complete: string;
    achievements: string;
    unlocked: string;
    totalPoints: string;
    completion: string;
    characterMastery: string;
    favorite: string;
    cosmetics: string;
    unlockedCount: string;
    characters: string;
  };
  story: {
    slide1Title: string;
    slide1Text: string;
    slide2Title: string;
    slide2Text: string;
    slide3Title: string;
    slide3Text: string;
    slide4Title: string;
    slide4Text: string;
    slide5Title: string;
    slide5Text: string;
    skip: string;
    skipAria: string;
    startGame: string;
    nextSlide: string;
    prevSlide: string;
    backToMenu: string;
  };
  howToPlay: {
    title: string;
    loading: string;
    steps: { title: string; description: string }[];
    desktop: string;
    mobile: string;
    tips: string;
    previous: string;
    next: string;
    train: string;
  };
  notFound: {
    title: string;
    description: string;
    backToHome: string;
    play: string;
  };
  loading: {
    title: string;
    preparing: string;
    loadError: string;
    tryAgain: string;
    general: string;
    tips: string[];
  };
}

const translations: Record<Locale, TranslationKeys> = {
  'pt-BR': {
    common: {
      play: 'Jogar', settings: 'Configurações', back: 'Voltar', continue: 'Continuar',
      cancel: 'Cancelar', confirm: 'Confirmar', loading: 'Carregando...', error: 'Erro',
      success: 'Sucesso', close: 'Fechar', save: 'Salvar', delete: 'Excluir',
      next: 'Próximo', previous: 'Anterior', level: 'Nível', max: 'MÁXIMO',
      equipped: 'EQUIPADO', locked: 'Bloqueado', completed: 'Concluído',
      credits: 'Credits', xp: 'XP', closeMenu: 'Fechar menu', openMenu: 'Abrir menu de navegação',
    },
    nav: {
      home: 'Início', map: 'Mapa', characters: 'Personagens', workshop: 'Oficina',
      arsenal: 'Arsenal', training: 'Treino', missions: 'Missões', profile: 'Perfil',
      howToPlay: 'Como Jogar', settings: 'Configurações',
    },
    home: {
      subtitle: 'Artilharia em Turnos', continueGame: 'CONTINUAR', newGame: 'INICIAR',
      version: 'v0.2.0-alpha', footer: 'Jogo original inspirado no gênero clássico de artillery games 2D em turnos.',
      footerTech: 'Astra Artillery — Desenvolvido com tecnologias web modernas',
    },
    menu: {
      title: 'Astra Artillery', newGame: 'Novo Jogo', continueGame: 'Continuar Jogo',
      settings: 'Configurações', characters: 'Personagens', workshop: 'Oficina', profile: 'Perfil',
    },
    battle: {
      start: 'Iniciar Batalha', victory: 'Vitória!', defeat: 'Derrota', turn: 'Turno',
      health: 'Vida', attack: 'Ataque', defense: 'Defesa', wind: 'VENTO',
      angle: 'ÂNGULO', you: 'VOCÊ', enemy: 'INIMIGO', turns: 'Turnos',
      yourDamage: 'Seu Dano', enemyDamage: 'Dano Inimigo', nextPhase: 'PRÓXIMA FASE',
      changeCharacter: 'MUDAR PERSONAGEM', preparingArena: 'Preparando arena...',
      rotateDevice: 'Gire seu aparelho', rotateHint: 'Para uma melhor experiência, jogue em orientação paisagem',
      pauseTitle: 'PAUSADO', pauseHint: 'Pressione ESC ou P para continuar',
      resume: 'CONTINUAR', quitBattle: 'SAIR DA BATALHA',
      fullscreen: 'Tela cheia', exitFullscreen: 'Sair da tela cheia',
      controlsHint: '[ESPACO] Carregar  [SETAS] Mirar  [A/D] Mover  [SHIFT] Habilidade',
    },
    settings: {
      title: 'CONFIGURAÇÕES', audio: 'Áudio', gameplay: 'Jogabilidade',
      visualEffects: 'Efeitos Visuais', accessibility: 'Acessibilidade', data: 'Dados',
      music: 'Música', musicVolume: 'Volume da Música', musicDesc: 'Música de fundo do jogo',
      sfx: 'Efeitos Sonoros', sfxVolume: 'Volume dos Efeitos', sfxDesc: 'Sons de tiros, explosões, interface',
      reduceAnimations: 'Reduzir Animações', reduceAnimationsDesc: 'Desativa transições e efeitos visuais',
      showDamageNumbers: 'Mostrar Números de Dano', showDamageNumbersDesc: 'Exibe números flutuantes ao receber dano',
      vibration: 'Vibração (Mobile)', vibrationDesc: 'Vibração ao atirar e acertar',
      screenShake: 'Screen Shake', screenShakeDesc: 'Tremor de tela ao impactar',
      screenFlash: 'Screen Flash', screenFlashDesc: 'Flash de tela em momentos de impacto',
      particles: 'Partículas', particlesDesc: 'Efeitos de partículas em explosões',
      highContrast: 'Alto Contraste', highContrastDesc: 'Aumenta contraste para melhor legibilidade',
      largeText: 'Texto Grande', largeTextDesc: 'Aumenta o tamanho da fonte',
      screenReader: 'Leitor de Tela', screenReaderDesc: 'Otimiza para leitores de tela',
      exportSave: 'Exportar Save', importSave: 'Importar Save',
      clearSave: 'Limpar Save', resetProgress: 'Resetar Progresso',
      exportDesc: 'Copia o save para a área de transferência',
      importDesc: 'Importa um save a partir de JSON',
      clearSaveDesc: 'Remove o save local (mantém progresso na nuvem)',
      resetProgressDesc: 'Remove todo o progresso local',
      saveCopied: 'Save copiado para a área de transferência!',
      noSaveFound: 'Nenhum save encontrado.', exportError: 'Erro ao exportar save.',
      saveImported: 'Save importado! Recarregando...',
      invalidJson: 'JSON inválido. Verifique o formato e tente novamente.',
      saveCleared: 'Save removido! Recarregando...',
      confirmClear: 'Tem certeza? Isso apagará apenas o save do jogo.',
      confirmReset: 'Tem certeza? Isso apagará todo seu progresso, personagens desbloqueados e configurações.',
      pasteJson: 'Cole o JSON do save abaixo:',
    },
    characters: {
      title: 'ESCOLHA SEU AVENTUREIRO', loading: 'Carregando personagens...',
      health: 'Vida', attack: 'Ataque', defense: 'Defesa', mobility: 'Mobilidade',
      specialAbility: 'Habilidade Especial', cooldown: 'turnos', confirm: 'CONFIRMAR',
      readyForBattle: 'Pronto para a batalha!', selectCharacter: 'Selecione um personagem para continuar',
      turns: 'turnos',
    },
    workshop: {
      title: 'OFICINA', loading: 'Carregando oficina...',
      cannon: 'Canhão', armor: 'Armadura', mobility: 'Mobilidade', special: 'Especial', cosmetics: 'Cosméticos',
      balance: 'Saldo', confirmPurchase: 'Confirmar Compra', cancel: 'Cancelar', buy: 'COMPRAR',
      insufficientFunds: 'Saldo insuficiente!', upgraded: 'melhorado!',
      upgradeFailed: 'Falha ao melhorar', unlockedEquipped: 'desbloqueado e equipado!',
      removed: 'removido', equipped: 'equipado',
      level: 'Nível', maxLevel: 'MÁXIMO', maxLevelReached: 'NÍVEL MÁXIMO ATINGIDO', upgrade: 'MELHORAR',
      cosmeticsHint: 'Cosméticos não afetam atributos de combate. Apenas aparência visual.',
    },
    arsenal: {
      title: 'ARSENAL', loading: 'Carregando arsenal...',
      projectiles: 'Projéteis', tacticalItems: 'Itens Táticos', count: 'itens', default: 'Padrão',
      stats: { damage: 'Dano', radius: 'Raio', speed: 'Velocidade', wind: 'Vento', gravity: 'Gravidade', mass: 'Massa' },
      charges: 'Cargas', price: 'Preço', effects: 'Efeitos', unlock: 'Desbloqueio:',
      behaviors: {
        balanced: 'Equilibrado', heavy: 'Pesado', cluster: 'Em Cacho', piercing: 'Perfurante',
        incendiary: 'Incendiário', freezing: 'Congelante', electric: 'Elétrico',
        ricochet: 'Ricochete', multi: 'Múltiplo', tactical: 'Tático',
      },
      rarities: { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário' },
    },
    training: {
      title: 'TREINAMENTO', loading: 'Carregando treinamento...',
      subtitle: 'Pratique suas habilidades sem penalizar progresso.',
      all: 'Todos', objectives: 'Objetivos', rewards: 'Recompensas',
      startTraining: 'INICIAR TREINO', completed: 'Concluído', locked: 'Bloqueado',
      requiredLevel: 'Nível necessário', credits: 'Credits', mastery: 'Mastery',
    },
    missions: {
      title: 'MISSÕES', loading: 'Carregando missões...',
      all: 'Todas', claim: 'Reivindicar', credits: 'Credits', xp: 'XP',
      lore: 'Lore', cosmetic: 'Cosmético', locked: 'Bloqueado',
      objectives: 'Objetivos', rewards: 'Recompensas', claimRewards: 'REIVINDICAR',
    },
    profile: {
      title: 'PERFIL', loading: 'Carregando perfil...',
      level: 'NÍVEL', commander: 'COMANDANTE', favoriteCharacter: 'Personagem favorito:',
      mastery: 'Maestria', nextReward: 'Próxima recompensa no nível...', maxLevel: 'Nível máximo atingido!',
      statsTitle: 'ESTATÍSTICAS GERAIS', victories: 'Vitórias', defeats: 'Derrotas',
      accuracy: 'Precisão', battles: 'Batalhas', stars: 'Estrelas', bosses: 'Bosses',
      damageDealt: 'Dano Causado', damageReceived: 'Dano Recebido', specials: 'Especiais',
      perfectWins: 'Vitórias Perfeitas', campaignProgress: 'PROGRESSO DA CAMPANHA',
      complete: 'COMPLETO', achievements: 'CONQUISTAS', unlocked: 'Desbloqueadas',
      totalPoints: 'Pontos Totais', completion: 'Completude',
      characterMastery: 'MAESTRIA DOS PERSONAGENS', favorite: '★ FAVORITO',
      cosmetics: 'COSMÉTICOS', unlockedCount: 'Desbloqueados', characters: 'Personagens',
    },
    story: {
      slide1Title: 'O MUNDO DE ASTRA', slide1Text: 'Há muito tempo, o mundo de Astra era um lugar pacífico...',
      slide2Title: 'A GRANDE RUPTURA', slide2Text: 'Um evento cataclísmico abalou os fundamentos do mundo...',
      slide3Title: 'A DISPUTA PELO PODER', slide3Text: 'Com o mundo em caos, facções surgiram disputando o controle...',
      slide4Title: 'UMA EQUIPE DE AVENTUREIROS', slide4Text: 'Entre o caos, um grupo de aventureiros se uniu...',
      slide5Title: 'SUA JORNADA COMEÇA', slide5Text: 'Agora é sua vez de entrar na batalha...',
      skip: 'Pular', skipAria: 'Pular história', startGame: 'Começar jogo',
      nextSlide: 'Próximo slide', prevSlide: 'Slide anterior', backToMenu: 'Voltar ao menu',
    },
    howToPlay: {
      title: 'COMO JOGAR', loading: 'Carregando tutorial...',
      steps: [
        { title: 'Objetivo', description: 'Use sua artilharia para derrotar o adversário.' },
        { title: 'Movimento', description: 'Use A/D ou setas para se mover.' },
        { title: 'Mira', description: 'Use W/S ou setas para ajustar o ângulo.' },
        { title: 'Potência', description: 'Segure ESPAÇO para carregar e solte para atirar.' },
        { title: 'Vento', description: 'Observe o vento — ele afeta a trajetória do projétil.' },
        { title: 'Habilidade Especial', description: 'Pressione SHIFT para usar a habilidade especial.' },
        { title: 'Projéteis', description: 'Diferentes projéteis têm comportamentos únicos.' },
        { title: 'Itens Táticos', description: 'Use itens táticos para vantagens estratégicas.' },
        { title: 'Terreno', description: 'O terreno afeta a movimentação e os impactos.' },
        { title: 'Campanha', description: 'Complete fases para desbloquear novas regiões.' },
      ],
      desktop: 'Desktop', mobile: 'Mobile', tips: 'Dicas',
      previous: '← Anterior', next: 'Próximo →', train: 'TREINAR →',
    },
    notFound: {
      title: 'Página Não Encontrada',
      description: 'A página que você procura não existe ou foi movida para outro endereço.',
      backToHome: 'Voltar ao Início', play: 'Jogar',
    },
    loading: {
      title: 'ASTRA ARTILLERY', preparing: 'Preparando...', loadError: 'Erro ao carregar',
      tryAgain: 'Tentar Novamente', general: 'Carregando...',
      tips: [
        'Use ventos a seu favor para tiros mais precisos',
        'Pressione SHIFT para usar habilidades especiais',
        'Cada personagem tem habilidades únicas',
        'Use o workshop para melhorar suas armas',
        'Astra Credits desbloqueiam novos personagens',
        'Treine no modo treino antes de batalhas importantes',
      ],
    },
  },
  'en-US': {
    common: {
      play: 'Play', settings: 'Settings', back: 'Back', continue: 'Continue',
      cancel: 'Cancel', confirm: 'Confirm', loading: 'Loading...', error: 'Error',
      success: 'Success', close: 'Close', save: 'Save', delete: 'Delete',
      next: 'Next', previous: 'Previous', level: 'Level', max: 'MAX',
      equipped: 'EQUIPPED', locked: 'Locked', completed: 'Completed',
      credits: 'Credits', xp: 'XP', closeMenu: 'Close menu', openMenu: 'Open navigation menu',
    },
    nav: {
      home: 'Home', map: 'Map', characters: 'Characters', workshop: 'Workshop',
      arsenal: 'Arsenal', training: 'Training', missions: 'Missions', profile: 'Profile',
      howToPlay: 'How to Play', settings: 'Settings',
    },
    home: {
      subtitle: 'Turn-Based Artillery', continueGame: 'CONTINUE', newGame: 'START',
      version: 'v0.2.0-alpha', footer: 'Original game inspired by the classic 2D turn-based artillery genre.',
      footerTech: 'Astra Artillery — Built with modern web technologies',
    },
    menu: {
      title: 'Astra Artillery', newGame: 'New Game', continueGame: 'Continue Game',
      settings: 'Settings', characters: 'Characters', workshop: 'Workshop', profile: 'Profile',
    },
    battle: {
      start: 'Start Battle', victory: 'Victory!', defeat: 'Defeat', turn: 'Turn',
      health: 'Health', attack: 'Attack', defense: 'Defense', wind: 'WIND',
      angle: 'ANGLE', you: 'YOU', enemy: 'ENEMY', turns: 'Turns',
      yourDamage: 'Your Damage', enemyDamage: 'Enemy Damage', nextPhase: 'NEXT PHASE',
      changeCharacter: 'CHANGE CHARACTER', preparingArena: 'Preparing arena...',
      rotateDevice: 'Rotate your device', rotateHint: 'For a better experience, play in landscape orientation',
      pauseTitle: 'PAUSED', pauseHint: 'Press ESC or P to continue',
      resume: 'CONTINUE', quitBattle: 'QUIT BATTLE',
      fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen',
      controlsHint: '[SPACE] Charge  [ARROWS] Aim  [A/D] Move  [SHIFT] Ability',
    },
    settings: {
      title: 'SETTINGS', audio: 'Audio', gameplay: 'Gameplay',
      visualEffects: 'Visual Effects', accessibility: 'Accessibility', data: 'Data',
      music: 'Music', musicVolume: 'Music Volume', musicDesc: 'Background game music',
      sfx: 'Sound Effects', sfxVolume: 'Effects Volume', sfxDesc: 'Shots, explosions, interface sounds',
      reduceAnimations: 'Reduce Animations', reduceAnimationsDesc: 'Disables transitions and visual effects',
      showDamageNumbers: 'Show Damage Numbers', showDamageNumbersDesc: 'Shows floating numbers on damage',
      vibration: 'Vibration (Mobile)', vibrationDesc: 'Vibrate on shot and hit',
      screenShake: 'Screen Shake', screenShakeDesc: 'Screen tremor on impact',
      screenFlash: 'Screen Flash', screenFlashDesc: 'Screen flash on impact moments',
      particles: 'Particles', particlesDesc: 'Particle effects in explosions',
      highContrast: 'High Contrast', highContrastDesc: 'Increases contrast for better readability',
      largeText: 'Large Text', largeTextDesc: 'Increases font size',
      screenReader: 'Screen Reader', screenReaderDesc: 'Optimizes for screen readers',
      exportSave: 'Export Save', importSave: 'Import Save',
      clearSave: 'Clear Save', resetProgress: 'Reset Progress',
      exportDesc: 'Copies save to clipboard', importDesc: 'Imports save from JSON',
      clearSaveDesc: 'Removes local save (keeps cloud progress)',
      resetProgressDesc: 'Removes all local progress',
      saveCopied: 'Save copied to clipboard!', noSaveFound: 'No save found.',
      exportError: 'Error exporting save.', saveImported: 'Save imported! Reloading...',
      invalidJson: 'Invalid JSON. Check the format and try again.',
      saveCleared: 'Save removed! Reloading...',
      confirmClear: 'Are you sure? This will only delete the game save.',
      confirmReset: 'Are you sure? This will delete all progress, unlocked characters and settings.',
      pasteJson: 'Paste the save JSON below:',
    },
    characters: {
      title: 'CHOOSE YOUR ADVENTURER', loading: 'Loading characters...',
      health: 'Health', attack: 'Attack', defense: 'Defense', mobility: 'Mobility',
      specialAbility: 'Special Ability', cooldown: 'turns', confirm: 'CONFIRM',
      readyForBattle: 'Ready for battle!', selectCharacter: 'Select a character to continue',
      turns: 'turns',
    },
    workshop: {
      title: 'WORKSHOP', loading: 'Loading workshop...',
      cannon: 'Cannon', armor: 'Armor', mobility: 'Mobility', special: 'Special', cosmetics: 'Cosmetics',
      balance: 'Balance', confirmPurchase: 'Confirm Purchase', cancel: 'Cancel', buy: 'BUY',
      insufficientFunds: 'Insufficient funds!', upgraded: 'upgraded!',
      upgradeFailed: 'Upgrade failed', unlockedEquipped: 'unlocked and equipped!',
      removed: 'removed', equipped: 'equipped',
      level: 'Level', maxLevel: 'MAX', maxLevelReached: 'MAX LEVEL REACHED', upgrade: 'UPGRADE',
      cosmeticsHint: 'Cosmetics do not affect combat stats. Visual appearance only.',
    },
    arsenal: {
      title: 'ARSENAL', loading: 'Loading arsenal...',
      projectiles: 'Projectiles', tacticalItems: 'Tactical Items', count: 'items', default: 'Default',
      stats: { damage: 'Damage', radius: 'Radius', speed: 'Speed', wind: 'Wind', gravity: 'Gravity', mass: 'Mass' },
      charges: 'Charges', price: 'Price', effects: 'Effects', unlock: 'Unlock:',
      behaviors: {
        balanced: 'Balanced', heavy: 'Heavy', cluster: 'Cluster', piercing: 'Piercing',
        incendiary: 'Incendiary', freezing: 'Freezing', electric: 'Electric',
        ricochet: 'Ricochet', multi: 'Multi', tactical: 'Tactical',
      },
      rarities: { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' },
    },
    training: {
      title: 'TRAINING', loading: 'Loading training...',
      subtitle: 'Practice your skills without penalty.',
      all: 'All', objectives: 'Objectives', rewards: 'Rewards',
      startTraining: 'START TRAINING', completed: 'Completed', locked: 'Locked',
      requiredLevel: 'Required level', credits: 'Credits', mastery: 'Mastery',
    },
    missions: {
      title: 'MISSIONS', loading: 'Loading missions...',
      all: 'All', claim: 'Claim', credits: 'Credits', xp: 'XP',
      lore: 'Lore', cosmetic: 'Cosmetic', locked: 'Locked',
      objectives: 'Objectives', rewards: 'Rewards', claimRewards: 'CLAIM',
    },
    profile: {
      title: 'PROFILE', loading: 'Loading profile...',
      level: 'LEVEL', commander: 'COMMANDER', favoriteCharacter: 'Favorite character:',
      mastery: 'Mastery', nextReward: 'Next reward at level...', maxLevel: 'Max level reached!',
      statsTitle: 'GENERAL STATS', victories: 'Victories', defeats: 'Defeats',
      accuracy: 'Accuracy', battles: 'Battles', stars: 'Stars', bosses: 'Bosses',
      damageDealt: 'Damage Dealt', damageReceived: 'Damage Received', specials: 'Specials',
      perfectWins: 'Perfect Wins', campaignProgress: 'CAMPAIGN PROGRESS',
      complete: 'COMPLETE', achievements: 'ACHIEVEMENTS', unlocked: 'Unlocked',
      totalPoints: 'Total Points', completion: 'Completion',
      characterMastery: 'CHARACTER MASTERY', favorite: '★ FAVORITE',
      cosmetics: 'COSMETICS', unlockedCount: 'Unlocked', characters: 'Characters',
    },
    story: {
      slide1Title: 'THE WORLD OF ASTRA', slide1Text: 'Long ago, the world of Astra was a peaceful place...',
      slide2Title: 'THE GREAT RUPTURE', slide2Text: 'A cataclysmic event shook the foundations of the world...',
      slide3Title: 'THE POWER STRUGGLE', slide3Text: 'With the world in chaos, factions arose competing for control...',
      slide4Title: 'A TEAM OF ADVENTURERS', slide4Text: 'Among the chaos, a group of adventurers united...',
      slide5Title: 'YOUR JOURNEY BEGINS', slide5Text: 'Now it\'s your turn to enter the battle...',
      skip: 'Skip', skipAria: 'Skip story', startGame: 'Start game',
      nextSlide: 'Next slide', prevSlide: 'Previous slide', backToMenu: 'Back to menu',
    },
    howToPlay: {
      title: 'HOW TO PLAY', loading: 'Loading tutorial...',
      steps: [
        { title: 'Objective', description: 'Use your artillery to defeat the opponent.' },
        { title: 'Movement', description: 'Use A/D or arrows to move.' },
        { title: 'Aim', description: 'Use W/S or arrows to adjust angle.' },
        { title: 'Power', description: 'Hold SPACE to charge and release to fire.' },
        { title: 'Wind', description: 'Observe the wind — it affects projectile trajectory.' },
        { title: 'Special Ability', description: 'Press SHIFT to use your special ability.' },
        { title: 'Projectiles', description: 'Different projectiles have unique behaviors.' },
        { title: 'Tactical Items', description: 'Use tactical items for strategic advantages.' },
        { title: 'Terrain', description: 'Terrain affects movement and impacts.' },
        { title: 'Campaign', description: 'Complete phases to unlock new regions.' },
      ],
      desktop: 'Desktop', mobile: 'Mobile', tips: 'Tips',
      previous: '← Previous', next: 'Next →', train: 'TRAIN →',
    },
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
      backToHome: 'Back to Home', play: 'Play',
    },
    loading: {
      title: 'ASTRA ARTILLERY', preparing: 'Preparing...', loadError: 'Error loading',
      tryAgain: 'Try Again', general: 'Loading...',
      tips: [
        'Use winds to your advantage for more accurate shots',
        'Press SHIFT to use special abilities',
        'Each character has unique abilities',
        'Use the workshop to upgrade your weapons',
        'Astra Credits unlock new characters',
        'Train in training mode before important battles',
      ],
    },
  },
  'es-ES': {
    common: {
      play: 'Jugar', settings: 'Ajustes', back: 'Volver', continue: 'Continuar',
      cancel: 'Cancelar', confirm: 'Confirmar', loading: 'Cargando...', error: 'Error',
      success: 'Éxito', close: 'Cerrar', save: 'Guardar', delete: 'Eliminar',
      next: 'Siguiente', previous: 'Anterior', level: 'Nivel', max: 'MÁXIMO',
      equipped: 'EQUIPADO', locked: 'Bloqueado', completed: 'Completado',
      credits: 'Credits', xp: 'XP', closeMenu: 'Cerrar menú', openMenu: 'Abrir menú de navegación',
    },
    nav: {
      home: 'Inicio', map: 'Mapa', characters: 'Personajes', workshop: 'Taller',
      arsenal: 'Arsenal', training: 'Entrenamiento', missions: 'Misiones', profile: 'Perfil',
      howToPlay: 'Cómo Jugar', settings: 'Ajustes',
    },
    home: {
      subtitle: 'Artillería por Turnos', continueGame: 'CONTINUAR', newGame: 'INICIAR',
      version: 'v0.2.0-alpha', footer: 'Juego original inspirado en el género clásico de artillery games 2D por turnos.',
      footerTech: 'Astra Artillery — Desarrollado con tecnologías web modernas',
    },
    menu: {
      title: 'Astra Artillery', newGame: 'Nuevo Juego', continueGame: 'Continuar Juego',
      settings: 'Ajustes', characters: 'Personajes', workshop: 'Taller', profile: 'Perfil',
    },
    battle: {
      start: 'Iniciar Batalla', victory: '¡Victoria!', defeat: 'Derrota', turn: 'Turno',
      health: 'Salud', attack: 'Ataque', defense: 'Defensa', wind: 'VIENTO',
      angle: 'ÁNGULO', you: 'TÚ', enemy: 'ENEMIGO', turns: 'Turnos',
      yourDamage: 'Tu Daño', enemyDamage: 'Daño Enemigo', nextPhase: 'SIGUIENTE FASE',
      changeCharacter: 'CAMBIAR PERSONAJE', preparingArena: 'Preparando arena...',
      rotateDevice: 'Gira tu dispositivo', rotateHint: 'Para una mejor experiencia, juega en orientación apaisada',
      pauseTitle: 'PAUSADO', pauseHint: 'Presiona ESC o P para continuar',
      resume: 'CONTINUAR', quitBattle: 'SALIR DE LA BATALLA',
      fullscreen: 'Pantalla completa', exitFullscreen: 'Salir de pantalla completa',
      controlsHint: '[ESPACIO] Cargar  [FLECHAS] Apuntar  [A/D] Mover  [SHIFT] Habilidad',
    },
    settings: {
      title: 'AJUSTES', audio: 'Audio', gameplay: 'Jugabilidad',
      visualEffects: 'Efectos Visuales', accessibility: 'Accesibilidad', data: 'Datos',
      music: 'Música', musicVolume: 'Volumen de Música', musicDesc: 'Música de fondo del juego',
      sfx: 'Efectos de Sonido', sfxVolume: 'Volumen de Efectos', sfxDesc: 'Disparos, explosiones, interfaz',
      reduceAnimations: 'Reducir Animaciones', reduceAnimationsDesc: 'Desactiva transiciones y efectos visuales',
      showDamageNumbers: 'Mostrar Números de Daño', showDamageNumbersDesc: 'Muestra números flotantes al recibir daño',
      vibration: 'Vibración (Mobile)', vibrationDesc: 'Vibrar al disparar y acertar',
      screenShake: 'Screen Shake', screenShakeDesc: 'Temblor de pantalla al impactar',
      screenFlash: 'Screen Flash', screenFlashDesc: 'Flash de pantalla en momentos de impacto',
      particles: 'Partículas', particlesDesc: 'Efectos de partículas en explosiones',
      highContrast: 'Alto Contraste', highContrastDesc: 'Aumenta contraste para mejor legibilidad',
      largeText: 'Texto Grande', largeTextDesc: 'Aumenta el tamaño de fuente',
      screenReader: 'Lector de Pantalla', screenReaderDesc: 'Optimiza para lectores de pantalla',
      exportSave: 'Exportar Save', importSave: 'Importar Save',
      clearSave: 'Limpiar Save', resetProgress: 'Resetear Progreso',
      exportDesc: 'Copia el save al portapapeles', importDesc: 'Importa un save desde JSON',
      clearSaveDesc: 'Elimina el save local (mantiene progreso en la nube)',
      resetProgressDesc: 'Elimina todo el progreso local',
      saveCopied: '¡Save copiado al portapapeles!', noSaveFound: 'No se encontró save.',
      exportError: 'Error al exportar save.', saveImported: '¡Save importado! Recargando...',
      invalidJson: 'JSON inválido. Verifica el formato e intenta de nuevo.',
      saveCleared: '¡Save eliminado! Recargando...',
      confirmClear: '¿Estás seguro? Esto solo eliminará el save del juego.',
      confirmReset: '¿Estás seguro? Esto eliminará todo el progreso, personajes desbloqueados y configuraciones.',
      pasteJson: 'Pega el JSON del save abajo:',
    },
    characters: {
      title: 'ELIGE TU AVENTURERO', loading: 'Cargando personajes...',
      health: 'Salud', attack: 'Ataque', defense: 'Defensa', mobility: 'Movilidad',
      specialAbility: 'Habilidad Especial', cooldown: 'turnos', confirm: 'CONFIRMAR',
      readyForBattle: '¡Listo para la batalla!', selectCharacter: 'Selecciona un personaje para continuar',
      turns: 'turnos',
    },
    workshop: {
      title: 'TALLER', loading: 'Cargando taller...',
      cannon: 'Cañón', armor: 'Armadura', mobility: 'Movilidad', special: 'Especial', cosmetics: 'Cosméticos',
      balance: 'Saldo', confirmPurchase: 'Confirmar Compra', cancel: 'Cancelar', buy: 'COMPRAR',
      insufficientFunds: '¡Saldo insuficiente!', upgraded: '¡mejorado!',
      upgradeFailed: 'Error al mejorar', unlockedEquipped: '¡desbloqueado y equipado!',
      removed: 'eliminado', equipped: 'equipado',
      level: 'Nivel', maxLevel: 'MÁXIMO', maxLevelReached: 'NIVEL MÁXIMO ALCANZADO', upgrade: 'MEJORAR',
      cosmeticsHint: 'Los cosméticos no afectan atributos de combate. Solo apariencia visual.',
    },
    arsenal: {
      title: 'ARSENAL', loading: 'Cargando arsenal...',
      projectiles: 'Proyectiles', tacticalItems: 'Items Tácticos', count: 'items', default: 'Predeterminado',
      stats: { damage: 'Daño', radius: 'Radio', speed: 'Velocidad', wind: 'Viento', gravity: 'Gravedad', mass: 'Masa' },
      charges: 'Cargas', price: 'Precio', effects: 'Efectos', unlock: 'Desbloqueo:',
      behaviors: {
        balanced: 'Equilibrado', heavy: 'Pesado', cluster: 'Racimo', piercing: 'Perforante',
        incendiary: 'Incendiario', freezing: 'Congelante', electric: 'Eléctrico',
        ricochet: 'Ricochete', multi: 'Múltiple', tactical: 'Táctico',
      },
      rarities: { common: 'Común', rare: 'Raro', epic: 'Épico', legendary: 'Legendario' },
    },
    training: {
      title: 'ENTRENAMIENTO', loading: 'Cargando entrenamiento...',
      subtitle: 'Practica tus habilidades sin penalización.',
      all: 'Todos', objectives: 'Objetivos', rewards: 'Recompensas',
      startTraining: 'INICIAR ENTRENAMIENTO', completed: 'Completado', locked: 'Bloqueado',
      requiredLevel: 'Nivel requerido', credits: 'Credits', mastery: 'Mastery',
    },
    missions: {
      title: 'MISIONES', loading: 'Cargando misiones...',
      all: 'Todas', claim: 'Reclamar', credits: 'Credits', xp: 'XP',
      lore: 'Lore', cosmetic: 'Cosmético', locked: 'Bloqueado',
      objectives: 'Objetivos', rewards: 'Recompensas', claimRewards: 'RECLAMAR',
    },
    profile: {
      title: 'PERFIL', loading: 'Cargando perfil...',
      level: 'NIVEL', commander: 'COMANDANTE', favoriteCharacter: 'Personaje favorito:',
      mastery: 'Maestría', nextReward: 'Siguiente recompensa en nivel...', maxLevel: '¡Nivel máximo alcanzado!',
      statsTitle: 'ESTADÍSTICAS GENERALES', victories: 'Victorias', defeats: 'Derrotas',
      accuracy: 'Precisión', battles: 'Batallas', stars: 'Estrellas', bosses: 'Jefes',
      damageDealt: 'Daño Causado', damageReceived: 'Daño Recibido', specials: 'Especiales',
      perfectWins: 'Victorias Perfectas', campaignProgress: 'PROGRESO DE CAMPAÑA',
      complete: 'COMPLETO', achievements: 'LOGROS', unlocked: 'Desbloqueados',
      totalPoints: 'Puntos Totales', completion: 'Completitud',
      characterMastery: 'MAESTRÍA DE PERSONAJES', favorite: '★ FAVORITO',
      cosmetics: 'COSMÉTICOS', unlockedCount: 'Desbloqueados', characters: 'Personajes',
    },
    story: {
      slide1Title: 'EL MUNDO DE ASTRA', slide1Text: 'Hace mucho tiempo, el mundo de Astra era un lugar pacífico...',
      slide2Title: 'LA GRAN RUPTURA', slide2Text: 'Un evento cataclísmico sacudió los cimientos del mundo...',
      slide3Title: 'LA LUCHA POR EL PODER', slide3Text: 'Con el mundo en caos, facciones surgieron disputando el control...',
      slide4Title: 'UN EQUIPO DE AVENTUREROS', slide4Text: 'Entre el caos, un grupo de aventureros se unió...',
      slide5Title: 'TU JOURNEY COMIENZA', slide5Text: 'Ahora es tu turno de entrar en la batalla...',
      skip: 'Saltar', skipAria: 'Saltar historia', startGame: 'Comenzar juego',
      nextSlide: 'Siguiente diapositiva', prevSlide: 'Diapositiva anterior', backToMenu: 'Volver al menú',
    },
    howToPlay: {
      title: 'CÓMO JUGAR', loading: 'Cargando tutorial...',
      steps: [
        { title: 'Objetivo', description: 'Usa tu artillería para derrotar al oponente.' },
        { title: 'Movimiento', description: 'Usa A/D o flechas para moverte.' },
        { title: 'Apuntar', description: 'Usa W/S o flechas para ajustar el ángulo.' },
        { title: 'Potencia', description: 'Mantén ESPACIO para cargar y suelta para disparar.' },
        { title: 'Viento', description: 'Observa el viento — afecta la trayectoria del proyectil.' },
        { title: 'Habilidad Especial', description: 'Presiona SHIFT para usar la habilidad especial.' },
        { title: 'Proyectiles', description: 'Diferentes proyectiles tienen comportamientos únicos.' },
        { title: 'Items Tácticos', description: 'Usa items tácticos para ventajas estratégicas.' },
        { title: 'Terreno', description: 'El terreno afecta el movimiento y los impactos.' },
        { title: 'Campaña', description: 'Completa fases para desbloquear nuevas regiones.' },
      ],
      desktop: 'Desktop', mobile: 'Mobile', tips: 'Consejos',
      previous: '← Anterior', next: 'Siguiente →', train: 'ENTRENAR →',
    },
    notFound: {
      title: 'Página No Encontrada',
      description: 'La página que buscas no existe o fue movida a otra dirección.',
      backToHome: 'Volver al Inicio', play: 'Jugar',
    },
    loading: {
      title: 'ASTRA ARTILLERY', preparing: 'Preparando...', loadError: 'Error al cargar',
      tryAgain: 'Intentar de Nuevo', general: 'Cargando...',
      tips: [
        'Usa los vientos a tu favor para tiros más precisos',
        'Presiona SHIFT para usar habilidades especiales',
        'Cada personagem tiene habilidades únicas',
        'Usa el taller para mejorar tus armas',
        'Los Credits desbloquean nuevos personajes',
        'Entrena en modo entrenamiento antes de batallas importantes',
      ],
    },
  },
};

const STORAGE_KEY = 'astra_locale';

export class I18n {
  private locale: Locale = 'pt-BR';
  private callbacks: Array<(locale: Locale) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'pt-BR' || stored === 'en-US' || stored === 'es-ES')) {
        this.locale = stored;
      } else {
        const browserLang = navigator.language;
        if (browserLang.startsWith('en')) {
          this.locale = 'en-US';
        } else if (browserLang.startsWith('es')) {
          this.locale = 'es-ES';
        } else {
          this.locale = 'pt-BR';
        }
      }
    }
  }

  getLocale(): Locale { return this.locale; }

  setLocale(locale: Locale): void {
    this.locale = locale;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
    this.notifyCallbacks();
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  }

  getTranslations(): TranslationKeys { return translations[this.locale]; }
  getAvailableLocales(): Locale[] { return ['pt-BR', 'en-US', 'es-ES']; }

  getLocaleName(locale: Locale): string {
    const names: Record<Locale, string> = {
      'pt-BR': 'Português (Brasil)', 'en-US': 'English', 'es-ES': 'Español',
    };
    return names[locale];
  }

  onChange(callback: (locale: Locale) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const idx = this.callbacks.indexOf(callback);
      if (idx > -1) this.callbacks.splice(idx, 1);
    };
  }

  private notifyCallbacks(): void { this.callbacks.forEach(cb => cb(this.locale)); }
  destroy(): void { this.callbacks = []; }
}

let instance: I18n | null = null;

export function getI18n(): I18n {
  if (!instance) { instance = new I18n(); }
  return instance;
}

export default I18n;
