export type RewardType = 
  | 'currency' 
  | 'xp' 
  | 'character_xp' 
  | 'cosmetic' 
  | 'skin' 
  | 'title' 
  | 'badge' 
  | 'lore' 
  | 'frame' 
  | 'trail' 
  | 'animation' 
  | 'banner' 
  | 'portrait';

export interface Reward {
  type: RewardType;
  id: string;
  quantity?: number;
  characterId?: string;
}

export interface GrantContext {
  getState: () => any;
  setState: (partial: any) => void;
  calculateLevelFromXp?: (xp: number) => number;
  calculateMasteryLevelFromXp?: (xp: number) => number;
}

type RewardHandler = (reward: Reward, context: GrantContext) => void;

const rewardHandlers: Record<RewardType, RewardHandler> = {
  currency: (reward, context) => {
    const state = context.getState();
    const amount = reward.quantity || 0;
    context.setState({ currency: state.currency + amount });
  },

  xp: (reward, context) => {
    const state = context.getState();
    const amount = reward.quantity || 0;
    const newXp = state.playerXp + amount;
    const calculateLevelFromXp = context.calculateLevelFromXp || ((xp: number) => 1);
    const newLevel = calculateLevelFromXp(newXp);
    
    context.setState({ playerXp: newXp, playerLevel: newLevel });
  },

  character_xp: (reward, context) => {
    const state = context.getState();
    const characterId = reward.characterId || state.selectedCharacterId;
    if (!characterId) return;
    
    const amount = reward.quantity || 0;
    const mastery = state.characterMastery[characterId] || { xp: 0, level: 1 };
    const newXp = mastery.xp + amount;
    const calculateMasteryLevelFromXp = context.calculateMasteryLevelFromXp || ((xp: number) => 1);
    const newLevel = calculateMasteryLevelFromXp(newXp);
    
    context.setState({
      characterMastery: {
        ...state.characterMastery,
        [characterId]: { xp: newXp, level: newLevel },
      },
    });
  },

  cosmetic: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  skin: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  frame: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  trail: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  animation: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  banner: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  portrait: (reward, context) => {
    const state = context.getState();
    if (!state.ownedCosmetics.includes(reward.id)) {
      context.setState({
        ownedCosmetics: [...state.ownedCosmetics, reward.id],
      });
    }
  },

  title: (reward, context) => {
    const state = context.getState();
    if (!state.ownedTitles) {
      context.setState({ ownedTitles: [] });
    }
    if (!state.ownedTitles.includes(reward.id)) {
      context.setState({
        ownedTitles: [...(state.ownedTitles || []), reward.id],
      });
    }
  },

  badge: (reward, context) => {
    const state = context.getState();
    if (!state.ownedBadges) {
      context.setState({ ownedBadges: [] });
    }
    if (!state.ownedBadges.includes(reward.id)) {
      context.setState({
        ownedBadges: [...(state.ownedBadges || []), reward.id],
      });
    }
  },

  lore: (reward, context) => {
    const state = context.getState();
    if (!state.unlockedLore) {
      context.setState({ unlockedLore: [] });
    }
    if (!state.unlockedLore.includes(reward.id)) {
      context.setState({
        unlockedLore: [...(state.unlockedLore || []), reward.id],
      });
    }
  },
};

export function grantReward(reward: Reward, context: GrantContext): void {
  const handler = rewardHandlers[reward.type];
  if (handler) {
    handler(reward, context);
  } else {
    console.warn(`No handler for reward type: ${reward.type}`);
  }
}

export function grantRewards(rewards: Reward[], context: GrantContext): void {
  for (const reward of rewards) {
    grantReward(reward, context);
  }
}

export function createGrantContext(getState: () => any, setState: (partial: any) => void): GrantContext {
  return { getState, setState };
}

export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  currency: 'Moedas',
  xp: 'XP do Jogador',
  character_xp: 'XP de Maestria',
  cosmetic: 'Cosmético',
  skin: 'Skin',
  title: 'Título',
  badge: 'Badge',
  lore: 'Lore',
  frame: 'Moldura',
  trail: 'Trilha',
  animation: 'Animação',
  banner: 'Banner',
  portrait: 'Retrato',
};