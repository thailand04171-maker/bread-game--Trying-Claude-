import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { FLOUR_TYPES } from '../../config/flourTypes';
import type { FlourType } from '../../types/bread';

export const InventoryPanel: React.FC = () => {
  const flourGrams = useGameStore((s) => s.flourGrams);
  const yeastGrams = useGameStore((s) => s.yeastGrams);
  const saltGrams = useGameStore((s) => s.saltGrams);
  const waterLiters = useGameStore((s) => s.waterLiters);
  const coins = useGameStore((s) => s.coins);
  const restockSupplies = useGameStore((s) => s.restockSupplies);

  return (
    <div className="inventory-panel">
      <h3>Pantry</h3>
      <ul>
        {Object.entries(flourGrams).map(([type, grams]) => (
          <li key={type}>
            {FLOUR_TYPES[type as FlourType]?.label ?? type}: {grams}g
          </li>
        ))}
        <li>Yeast: {yeastGrams}g</li>
        <li>Salt: {saltGrams}g</li>
        <li>Water: {waterLiters.toFixed(1)}L</li>
      </ul>
      <button onClick={restockSupplies} disabled={coins < 40}>
        Restock Supplies (💰40)
      </button>
    </div>
  );
};
