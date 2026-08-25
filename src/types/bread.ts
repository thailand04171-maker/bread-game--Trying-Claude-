export type Stage = 'mixing' | 'kneading' | 'proofing' | 'scoring' | 'baking' | 'finished' | 'ruined';

export type FlourType = 'all_purpose' | 'bread_flour' | 'whole_wheat' | 'rye';

export interface Ingredient {
  id: string;
  name: string;
  weightGrams: number;
}

export interface ActiveBatch {
  id: string;
  recipeId: string;
  recipeName: string;
  currentStage: Stage;

  // Mixing & Hydration
  flourType: FlourType;
  flourWeightGrams: number;
  waterWeightGrams: number;
  yeastGrams: number;
  saltGrams: number;
  hydrationPercent: number; // Computed: (water / flour) * 100

  // Kneading
  glutenDevelopment: number; // 0 to 100

  // Proofing
  targetProofTime: number; // seconds
  elapsedProofTime: number; // seconds
  ambientTempC: number;
  volumeMultiplier: number; // 1.0 to 2.5

  // Scoring
  scoreLines: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  scoreDepth: number; // 0 to 1

  // Baking
  ovenTempC: number;
  targetBakeTime: number;
  elapsedBakeTime: number;
  crustDoneness: number; // 0 (raw) -> 100 (perfect) -> >120 (burnt)

  // Final Result Quality Score
  finalQualityScore?: number; // 0 to 100
  estimatedValue?: number;
}

export interface Customer {
  id: string;
  name: string;
  desiredRecipeId: string;
  tipMultiplier: number;
}
