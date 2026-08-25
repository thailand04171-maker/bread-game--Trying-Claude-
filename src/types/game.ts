export type ScreenView = 'game' | 'recipes' | 'upgrades';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface SaleRecord {
  id: string;
  recipeName: string;
  qualityScore: number;
  coinsEarned: number;
  timestamp: number;
}
