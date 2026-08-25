import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RECIPE_LIST } from '../../config/recipes';
import { FLOUR_TYPES } from '../../config/flourTypes';

export const RecipeBook: React.FC = () => {
  const unlockedRecipes = useGameStore((s) => s.unlockedRecipes);

  return (
    <div className="recipe-book">
      <h2>Recipe Book</h2>
      <p className="hint">Hit these targets during mixing, proofing, and baking for the best quality score.</p>

      <div className="recipe-book-grid">
        {RECIPE_LIST.map((recipe) => {
          const isUnlocked = unlockedRecipes.includes(recipe.id);
          return (
            <div key={recipe.id} className={`recipe-book-card ${isUnlocked ? '' : 'locked'}`}>
              <div className="recipe-book-header">
                <h4>{recipe.name}</h4>
                {!isUnlocked && <span className="locked-badge">Locked</span>}
              </div>
              <p className="recipe-book-desc">{recipe.description}</p>

              <dl className="recipe-stats">
                <div>
                  <dt>Flour</dt>
                  <dd>{FLOUR_TYPES[recipe.defaultFlourType].label}</dd>
                </div>
                <div>
                  <dt>Hydration</dt>
                  <dd>{recipe.targetHydrationPercent}%</dd>
                </div>
                <div>
                  <dt>Proof Time</dt>
                  <dd>{recipe.targetProofTimeSeconds}s</dd>
                </div>
                <div>
                  <dt>Bake Time</dt>
                  <dd>{recipe.targetBakeTimeSeconds}s</dd>
                </div>
                <div>
                  <dt>Oven Temp</dt>
                  <dd>{recipe.targetOvenTempC}°C</dd>
                </div>
              </dl>

              <ul className="recipe-tips">
                {recipe.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
