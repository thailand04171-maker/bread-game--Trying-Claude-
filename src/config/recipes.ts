import type { FlourType } from '../types/bread';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  defaultFlourType: FlourType;
  targetHydrationPercent: number;
  targetProofTimeSeconds: number;
  targetBakeTimeSeconds: number;
  targetOvenTempC: number;
  basePrice: number; // coins earned at a perfect (100) quality score
  unlockCost: number; // coins required to unlock, 0 if unlocked by default
  tips: string[];
}

export const RECIPES: Record<string, Recipe> = {
  classic_sourdough: {
    id: 'classic_sourdough',
    name: 'Classic Sourdough',
    description: 'A tangy, chewy loaf with a crackling crust. The bakery staple.',
    defaultFlourType: 'bread_flour',
    targetHydrationPercent: 75,
    targetProofTimeSeconds: 60,
    targetBakeTimeSeconds: 45,
    targetOvenTempC: 220,
    basePrice: 60,
    unlockCost: 0,
    tips: [
      'Target 75% hydration — about 750g water for every 1000g of bread flour.',
      'Knead until the gluten bar is completely full before moving on; sourdough needs strong structure.',
      'Let it proof the full target time so the volume roughly doubles before scoring.',
      'Bake at 220°C and pull it around 90–100% crust doneness for a deep golden crust without burning.',
    ],
  },
  rustic_baguette: {
    id: 'rustic_baguette',
    name: 'Rustic Baguette',
    description: 'A crisp, airy French classic. Needs precise scoring.',
    defaultFlourType: 'all_purpose',
    targetHydrationPercent: 68,
    targetProofTimeSeconds: 45,
    targetBakeTimeSeconds: 35,
    targetOvenTempC: 240,
    basePrice: 45,
    unlockCost: 0,
    tips: [
      'Keep hydration closer to 68% — baguettes want a firmer dough than sourdough.',
      'This recipe bakes hot and fast (240°C) — watch the crust doneness bar closely near the end.',
      'A few confident slashes during scoring matter more than many small ones for that classic look.',
      'Shorter proof time than sourdough — don’t let it overproof or it will collapse when scored.',
    ],
  },
  whole_wheat_boule: {
    id: 'whole_wheat_boule',
    name: 'Whole Wheat Boule',
    description: 'A hearty, dense round loaf packed with nutty flavor.',
    defaultFlourType: 'whole_wheat',
    targetHydrationPercent: 80,
    targetProofTimeSeconds: 75,
    targetBakeTimeSeconds: 50,
    targetOvenTempC: 210,
    basePrice: 70,
    unlockCost: 150,
    tips: [
      'Whole wheat drinks up more water — push hydration up to around 80%.',
      'Give it the longest proof of the basic loaves; whole grain dough rises more slowly.',
      'A slightly lower oven temp (210°C) keeps the dense crumb from drying out before the crust sets.',
      'Don’t rush kneading — whole wheat gluten takes a bit more work to develop fully.',
    ],
  },
  dark_rye_loaf: {
    id: 'dark_rye_loaf',
    name: 'Dark Rye Loaf',
    description: 'A dense, malty loaf for the adventurous baker.',
    defaultFlourType: 'rye',
    targetHydrationPercent: 85,
    targetProofTimeSeconds: 90,
    targetBakeTimeSeconds: 55,
    targetOvenTempC: 200,
    basePrice: 90,
    unlockCost: 300,
    tips: [
      'Rye is thirsty and low-gluten — aim for a wet 85% hydration dough.',
      'Gluten will never fully feel "strong" like wheat flour; that’s normal for rye, just hit the target bar.',
      'This one needs the longest proof of all the recipes — be patient before scoring.',
      'Bake low and slow at 200°C; rye crusts can look done on the outside while the crumb is still gummy.',
    ],
  },
};

export const RECIPE_LIST = Object.values(RECIPES);
