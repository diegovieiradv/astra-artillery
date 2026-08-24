export interface EquipmentStats {
  damage: number;
  accuracy: number;
  range: number;
  splashRadius: number;
  weight: number;
  specialEffect?: string;
}

export interface ComparisonResult {
  stat: string;
  current: number;
  incoming: number;
  difference: number;
  isBetter: boolean;
}

const BASE_EQUIPMENT: Record<string, EquipmentStats> = {
  normal: { damage: 50, accuracy: 85, range: 70, splashRadius: 0, weight: 1 },
  piercing: { damage: 70, accuracy: 75, range: 60, splashRadius: 0, weight: 1.2, specialEffect: 'Perfura alvos' },
  bouncing: { damage: 40, accuracy: 65, range: 80, splashRadius: 0, weight: 0.8, specialEffect: 'Salta em superficies' },
  cluster: { damage: 30, accuracy: 70, range: 50, splashRadius: 40, weight: 1.5, specialEffect: 'Explode em fragmentos' },
};

export function getEquipmentStats(projectileId: string): EquipmentStats {
  return BASE_EQUIPMENT[projectileId] || BASE_EQUIPMENT.normal;
}

export function compareEquipment(currentId: string, incomingId: string): ComparisonResult[] {
  const current = getEquipmentStats(currentId);
  const incoming = getEquipmentStats(incomingId);

  const stats: Array<{ key: keyof EquipmentStats; label: string; higherBetter: boolean }> = [
    { key: 'damage', label: 'Dano', higherBetter: true },
    { key: 'accuracy', label: 'Precisao', higherBetter: true },
    { key: 'range', label: 'Alcance', higherBetter: true },
    { key: 'splashRadius', label: 'Raio de Explosao', higherBetter: true },
    { key: 'weight', label: 'Peso', higherBetter: false },
  ];

  return stats.map(({ key, label, higherBetter }) => {
    const c = current[key] as number;
    const i = incoming[key] as number;
    const diff = i - c;
    const isBetter = higherBetter ? diff > 0 : diff < 0;
    return { stat: label, current: c, incoming: i, difference: diff, isBetter };
  });
}

export function getComparisonSummary(currentId: string, incomingId: string): {
  overallBetter: boolean;
  pros: string[];
  cons: string[];
} {
  const comparisons = compareEquipment(currentId, incomingId);
  const pros = comparisons.filter(c => c.isBetter).map(c => `${c.stat} +${Math.abs(c.difference).toFixed(0)}`);
  const cons = comparisons.filter(c => !c.isBetter && c.difference !== 0).map(c => `${c.stat} ${c.difference.toFixed(0)}`);
  return {
    overallBetter: pros.length > cons.length,
    pros,
    cons,
  };
}
