import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RECIPE_LIST } from '../../config/recipes';

export const RecipeSelect: React.FC = () => {
  const unlockedRecipes = useGameStore((s) => s.unlockedRecipes);
  const coins = useGameStore((s) => s.coins);
  const startNewBatch = useGameStore((s) => s.startNewBatch);
  const unlockRecipe = useGameStore((s) => s.unlockRecipe);

  return (
    <div className="start-screen">
      <h2>Select a Recipe to Start</h2>
      <div className="recipe-grid">
        {RECIPE_LIST.map((recipe) => {
          const isUnlocked = unlockedRecipes.includes(recipe.id);
          return (
            <div key={recipe.id} className="recipe-card">
              <h4>{recipe.name}</h4>
              <p>{recipe.description}</p>
              {isUnlocked ? (
                <button onClick={() => startNewBatch(recipe.id, recipe.defaultFlourType)}>Bake</button>
              ) : (
                <button onClick={() => unlockRecipe(recipe.id)} disabled={coins < recipe.unlockCost}>
                  Unlock (💰{recipe.unlockCost})
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
