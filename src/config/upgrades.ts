export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'stand_mixer',
    name: 'Stand Mixer',
    description: 'Reduces the number of kneading strokes needed to fully develop gluten.',
    cost: 200,
    effect: 'kneadStrokeBonus:1.5x',
  },
  {
    id: 'proofing_cabinet',
    name: 'Proofing Cabinet',
    description: 'Holds a stable, ideal temperature so proofing is more predictable.',
    cost: 250,
    effect: 'proofTempStability',
  },
  {
    id: 'commercial_oven',
    name: 'Commercial Oven',
    description: 'More even heat distribution reduces the risk of burnt crusts.',
    cost: 400,
    effect: 'bakeToleranceBonus:1.3x',
  },
  {
    id: 'display_case',
    name: 'Display Case',
    description: 'Attracts more customers to your bakery, more often.',
    cost: 300,
    effect: 'customerSpawnRateBonus:1.3x',
  },
];
