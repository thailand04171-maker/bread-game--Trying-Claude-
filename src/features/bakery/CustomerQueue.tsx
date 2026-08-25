import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RECIPES } from '../../config/recipes';

export const CustomerQueue: React.FC = () => {
  const activeCustomers = useGameStore((s) => s.activeCustomers);
  const currentBatch = useGameStore((s) => s.currentBatch);
  const serveCustomer = useGameStore((s) => s.serveCustomer);

  return (
    <div className="customer-queue">
      <h3>Customers</h3>
      {activeCustomers.length === 0 && <p className="empty-hint">No one waiting right now.</p>}
      <ul>
        {activeCustomers.map((c) => {
          const recipeName = RECIPES[c.desiredRecipeId]?.name ?? c.desiredRecipeId;
          const canServe =
            currentBatch?.currentStage === 'finished' && currentBatch.recipeId === c.desiredRecipeId;

          return (
            <li key={c.id} className="customer-row">
              <div className="customer-info">
                <strong>{c.name}</strong> wants <em>{recipeName}</em>
              </div>
              <button disabled={!canServe} onClick={() => serveCustomer(c.id)}>
                Serve
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
