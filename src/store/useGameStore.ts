import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ActiveBatch, Customer, Stage } from '../types/bread';
import { RECIPES } from '../config/recipes';
import { FLOUR_TYPES } from '../config/flourTypes';
import { UPGRADES } from '../config/upgrades';

interface BakeryState {
  coins: number;
  reputation: number;
  unlockedRecipes: string[];
  activeCustomers: Customer[];
  purchasedUpgrades: string[];
}

interface InventoryState {
  flourGrams: Record<string, number>;
  yeastGrams: number;
  saltGrams: number;
  waterLiters: number;
}

interface ActiveBatchState {
  currentBatch: ActiveBatch | null;
  startNewBatch: (recipeId: string, flourType: string) => void;
  addIngredient: (type: 'water' | 'flour' | 'yeast' | 'salt', grams: number) => void;
  resetMixing: () => void;
  advanceStage: (nextStage: Stage) => void;
  updateKneadProgress: (delta: number) => void;
  addScoreLine: (line: { x1: number; y1: number; x2: number; y2: number }) => void;
  tickProofing: (deltaSeconds: number) => void;
  tickBaking: (deltaSeconds: number) => void;
  finishBatch: () => void;
  discardBatch: () => void;
}

interface BakeryActions {
  unlockRecipe: (recipeId: string) => void;
  restockSupplies: () => void;
  purchaseUpgrade: (upgradeId: string) => void;
  spawnCustomer: () => void;
  serveCustomer: (customerId: string) => void;
  resetGame: () => void;
}

type GameStore = BakeryState & InventoryState & ActiveBatchState & BakeryActions;

const CUSTOMER_NAMES = ['Alex', 'Priya', 'Sam', 'Jordan', 'Nina', 'Kofi', 'Mika', 'Elena', 'Theo', 'Yuki'];
const MAX_ACTIVE_CUSTOMERS = 4;
const RESTOCK_COST = 40;

const INITIAL_PROGRESS_STATE: BakeryState & InventoryState & { currentBatch: ActiveBatch | null } = {
  coins: 250,
  reputation: 10,
  unlockedRecipes: ['classic_sourdough', 'rustic_baguette'],
  activeCustomers: [],
  purchasedUpgrades: [],
  flourGrams: { all_purpose: 5000, bread_flour: 3000, whole_wheat: 1000, rye: 500 },
  yeastGrams: 500,
  saltGrams: 1000,
  waterLiters: 50,
  currentBatch: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // --- BAKERY / INVENTORY / ACTIVE BATCH INITIAL STATE ---
      ...INITIAL_PROGRESS_STATE,

      startNewBatch: (recipeId, flourType) => {
        const recipe = RECIPES[recipeId];
        const hasProofingCabinet = get().purchasedUpgrades.includes('proofing_cabinet');
        set({
          currentBatch: {
            id: crypto.randomUUID(),
            recipeId,
            recipeName: recipe?.name ?? recipeId,
            currentStage: 'mixing',
            flourType: (flourType || recipe?.defaultFlourType || 'all_purpose') as any,
            flourWeightGrams: 0,
            waterWeightGrams: 0,
            yeastGrams: 0,
            saltGrams: 0,
            hydrationPercent: 0,
            glutenDevelopment: 0,
            targetProofTime: recipe?.targetProofTimeSeconds ?? 60,
            elapsedProofTime: 0,
            // Proofing Cabinet holds a stable, ideal ambient temp (26C); without it, room temp (24C) is a bit off-ideal.
            ambientTempC: hasProofingCabinet ? 26 : 24,
            volumeMultiplier: 1.0,
            scoreLines: [],
            scoreDepth: 0,
            ovenTempC: recipe?.targetOvenTempC ?? 220,
            targetBakeTime: recipe?.targetBakeTimeSeconds ?? 45,
            elapsedBakeTime: 0,
            crustDoneness: 0,
          },
        });
      },

      addIngredient: (type, grams) => {
        const state = get();
        const batch = state.currentBatch;
        if (!batch || batch.currentStage !== 'mixing') return;

        // Enforce pantry limits so the shop economy actually matters.
        if (type === 'flour' && (state.flourGrams[batch.flourType] ?? 0) < grams) return;
        if (type === 'yeast' && state.yeastGrams < grams) return;
        if (type === 'salt' && state.saltGrams < grams) return;
        if (type === 'water' && state.waterLiters * 1000 < grams) return;

        const updated = { ...batch };
        if (type === 'flour') updated.flourWeightGrams += grams;
        if (type === 'water') updated.waterWeightGrams += grams;
        if (type === 'yeast') updated.yeastGrams += grams;
        if (type === 'salt') updated.saltGrams += grams;

        if (updated.flourWeightGrams > 0) {
          updated.hydrationPercent = Math.round(
            (updated.waterWeightGrams / updated.flourWeightGrams) * 100
          );
        }

        const inventoryPatch: Partial<InventoryState> = {};
        if (type === 'flour') {
          inventoryPatch.flourGrams = {
            ...state.flourGrams,
            [batch.flourType]: state.flourGrams[batch.flourType] - grams,
          };
        }
        if (type === 'yeast') inventoryPatch.yeastGrams = state.yeastGrams - grams;
        if (type === 'salt') inventoryPatch.saltGrams = state.saltGrams - grams;
        if (type === 'water') inventoryPatch.waterLiters = state.waterLiters - grams / 1000;

        set({ currentBatch: updated, ...inventoryPatch });
      },

      resetMixing: () => {
        const state = get();
        const batch = state.currentBatch;
        if (!batch || batch.currentStage !== 'mixing') return;
        // Refund everything scooped into the bowl back to the pantry so resetting is free.
        if (
          batch.flourWeightGrams === 0 &&
          batch.waterWeightGrams === 0 &&
          batch.yeastGrams === 0 &&
          batch.saltGrams === 0
        ) {
          return;
        }

        const flourGrams = { ...state.flourGrams };
        flourGrams[batch.flourType] = (flourGrams[batch.flourType] ?? 0) + batch.flourWeightGrams;

        set({
          flourGrams,
          yeastGrams: state.yeastGrams + batch.yeastGrams,
          saltGrams: state.saltGrams + batch.saltGrams,
          waterLiters: state.waterLiters + batch.waterWeightGrams / 1000,
          currentBatch: {
            ...batch,
            flourWeightGrams: 0,
            waterWeightGrams: 0,
            yeastGrams: 0,
            saltGrams: 0,
            hydrationPercent: 0,
          },
        });
      },

      advanceStage: (nextStage) => {
        const batch = get().currentBatch;
        if (!batch) return;
        set({ currentBatch: { ...batch, currentStage: nextStage } });
      },

      updateKneadProgress: (delta) => {
        const state = get();
        const batch = state.currentBatch;
        if (!batch || batch.currentStage !== 'kneading') return;
        const hasStandMixer = state.purchasedUpgrades.includes('stand_mixer');
        const effectiveDelta = hasStandMixer ? delta * 1.5 : delta;
        const newGluten = Math.min(100, batch.glutenDevelopment + effectiveDelta);
        set({ currentBatch: { ...batch, glutenDevelopment: newGluten } });
      },

      addScoreLine: (line) => {
        const batch = get().currentBatch;
        if (!batch || batch.currentStage !== 'scoring') return;
        const scoreLines = [...batch.scoreLines, line];
        const scoreDepth = Math.min(1, scoreLines.length * 0.2);
        set({ currentBatch: { ...batch, scoreLines, scoreDepth } });
      },

      tickProofing: (deltaSeconds) => {
        const batch = get().currentBatch;
        if (!batch || batch.currentStage !== 'proofing') return;

        const newElapsed = batch.elapsedProofTime + deltaSeconds;
        const tempFactor = batch.ambientTempC / 24;
        const newVolume = 1.0 + (newElapsed / batch.targetProofTime) * 1.0 * tempFactor;

        set({
          currentBatch: {
            ...batch,
            elapsedProofTime: newElapsed,
            volumeMultiplier: newVolume,
          },
        });
      },

      tickBaking: (deltaSeconds) => {
        const state = get();
        const batch = state.currentBatch;
        if (!batch || batch.currentStage !== 'baking') return;

        const hasCommercialOven = state.purchasedUpgrades.includes('commercial_oven');
        const newElapsed = batch.elapsedBakeTime + deltaSeconds;
        const tempEfficiency = batch.ovenTempC / 220;
        // Commercial Oven distributes heat more evenly, slowing doneness growth so there's
        // a wider forgiving window before the crust burns.
        const ovenToleranceFactor = hasCommercialOven ? 0.8 : 1;
        const newDoneness = (newElapsed / batch.targetBakeTime) * 100 * tempEfficiency * ovenToleranceFactor;

        set({
          currentBatch: {
            ...batch,
            elapsedBakeTime: newElapsed,
            crustDoneness: newDoneness,
          },
        });
      },

      finishBatch: () => {
        const batch = get().currentBatch;
        if (!batch) return;
        const recipe = RECIPES[batch.recipeId];
        const targetHydration = recipe?.targetHydrationPercent ?? 75;
        const basePrice = recipe?.basePrice ?? 50;

        const hydrationDev = Math.abs(batch.hydrationPercent - targetHydration);
        const glutenDev = Math.abs(batch.glutenDevelopment - 100);
        const bakeDev = Math.abs(batch.crustDoneness - 100);

        const score = Math.max(0, 100 - (hydrationDev * 1.5 + glutenDev * 0.5 + bakeDev * 0.8));
        const reward = Math.round(basePrice * (score / 100) + 10);

        set((state) => ({
          coins: state.coins + reward,
          reputation: state.reputation + (score > 80 ? 2 : -1),
          currentBatch: {
            ...batch,
            currentStage: 'finished',
            finalQualityScore: Math.round(score),
            estimatedValue: reward,
          },
        }));
      },

      discardBatch: () => set({ currentBatch: null }),

      // --- BAKERY / SHOP ACTIONS ---

      purchaseUpgrade: (upgradeId) => {
        const state = get();
        if (state.purchasedUpgrades.includes(upgradeId)) return;
        const upgrade = UPGRADES.find((u) => u.id === upgradeId);
        if (!upgrade || state.coins < upgrade.cost) return;
        set({
          coins: state.coins - upgrade.cost,
          purchasedUpgrades: [...state.purchasedUpgrades, upgradeId],
        });
      },

      unlockRecipe: (recipeId) => {
        const state = get();
        if (state.unlockedRecipes.includes(recipeId)) return;
        const recipe = RECIPES[recipeId];
        if (!recipe || state.coins < recipe.unlockCost) return;
        set({
          coins: state.coins - recipe.unlockCost,
          unlockedRecipes: [...state.unlockedRecipes, recipeId],
        });
      },

      restockSupplies: () => {
        const state = get();
        if (state.coins < RESTOCK_COST) return;
        const flourGrams = { ...state.flourGrams };
        for (const key of Object.keys(FLOUR_TYPES)) {
          flourGrams[key] = (flourGrams[key] ?? 0) + 1000;
        }
        set({
          coins: state.coins - RESTOCK_COST,
          flourGrams,
          yeastGrams: state.yeastGrams + 200,
          saltGrams: state.saltGrams + 300,
          waterLiters: state.waterLiters + 20,
        });
      },

      spawnCustomer: () => {
        const state = get();
        if (state.activeCustomers.length >= MAX_ACTIVE_CUSTOMERS) return;
        if (state.unlockedRecipes.length === 0) return;

        const recipeId =
          state.unlockedRecipes[Math.floor(Math.random() * state.unlockedRecipes.length)];

        const customer: Customer = {
          id: crypto.randomUUID(),
          name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
          desiredRecipeId: recipeId,
          tipMultiplier: 1 + Math.random() * 0.5,
        };

        set({ activeCustomers: [...state.activeCustomers, customer] });
      },

      serveCustomer: (customerId) => {
        const state = get();
        const batch = state.currentBatch;
        const customer = state.activeCustomers.find((c) => c.id === customerId);
        if (!batch || !customer) return;
        if (batch.currentStage !== 'finished' || batch.recipeId !== customer.desiredRecipeId) return;

        const baseValue = batch.estimatedValue ?? 0;
        const tipBonus = Math.round(baseValue * (customer.tipMultiplier - 1));

        set({
          coins: state.coins + tipBonus,
          reputation: state.reputation + 3,
          activeCustomers: state.activeCustomers.filter((c) => c.id !== customerId),
          currentBatch: null,
        });
      },

      // Full wipe back to a fresh save. Also serves as a guaranteed escape hatch out of
      // any soft-lock or deadlock state (e.g. no coins, no ingredients, nothing sellable).
      resetGame: () => set({ ...INITIAL_PROGRESS_STATE }),
    }),
    {
      name: 'bread-game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        coins: state.coins,
        reputation: state.reputation,
        unlockedRecipes: state.unlockedRecipes,
        purchasedUpgrades: state.purchasedUpgrades,
        flourGrams: state.flourGrams,
        yeastGrams: state.yeastGrams,
        saltGrams: state.saltGrams,
        waterLiters: state.waterLiters,
        // Persist the in-progress batch and waiting customers too, so closing the tab
        // mid-bake doesn't lose your place.
        currentBatch: state.currentBatch,
        activeCustomers: state.activeCustomers,
      }),
    }
  )
);
