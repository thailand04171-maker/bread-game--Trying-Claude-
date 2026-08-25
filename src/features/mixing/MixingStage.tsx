import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { FLOUR_TYPES } from '../../config/flourTypes';

type IngredientType = 'flour' | 'water' | 'yeast' | 'salt';

interface Pour {
  id: string;
  type: IngredientType;
  offset: number;
}

const INGREDIENT_COLOR: Record<IngredientType, string> = {
  flour: '#f3e2c7',
  water: '#a9d4e8',
  yeast: '#d8a15c',
  salt: '#ffffff',
};

const INGREDIENT_AMOUNTS: Record<IngredientType, number> = {
  flour: 100,
  water: 75,
  yeast: 5,
  salt: 2,
};

export const MixingStage: React.FC = () => {
  const batch = useGameStore((s) => s.currentBatch);
  const addIngredient = useGameStore((s) => s.addIngredient);
  const resetMixing = useGameStore((s) => s.resetMixing);
  const advanceStage = useGameStore((s) => s.advanceStage);
  const [pours, setPours] = useState<Pour[]>([]);

  if (!batch) return null;

  const isEmpty =
    batch.flourWeightGrams === 0 &&
    batch.waterWeightGrams === 0 &&
    batch.yeastGrams === 0 &&
    batch.saltGrams === 0;

  const handleAdd = (type: IngredientType) => {
    addIngredient(type, INGREDIENT_AMOUNTS[type]);

    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPours((prev) => [...prev, { id, type, offset: (Math.random() - 0.5) * 30 }]);
    window.setTimeout(() => {
      setPours((prev) => prev.filter((pour) => pour.id !== id));
    }, 700);
  };

  const totalGrams = batch.flourWeightGrams + batch.waterWeightGrams + batch.yeastGrams + batch.saltGrams;
  const fillScale = Math.min(1.4, 0.4 + totalGrams / 400);
  const doughColor = FLOUR_TYPES[batch.flourType]?.color ?? '#f3e2c7';

  return (
    <div className="mixing-stage">
      <h2>Mixing</h2>
      <p>Hydration: {batch.hydrationPercent}%</p>
      <p className="mixing-summary">
        Flour: {batch.flourWeightGrams}g · Water: {batch.waterWeightGrams}g · Yeast: {batch.yeastGrams}g · Salt:{' '}
        {batch.saltGrams}g
      </p>

      <div className="mixing-visual">
        <AnimatePresence>
          {pours.map((pour) => (
            <motion.span
              key={pour.id}
              className={`pour-drop pour-${pour.type}`}
              style={{ left: `calc(50% + ${pour.offset}px)`, background: INGREDIENT_COLOR[pour.type] }}
              initial={{ y: -70, opacity: 0, scale: 0.6 }}
              animate={{ y: 55, opacity: [0, 1, 1, 0], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeIn' }}
            />
          ))}
        </AnimatePresence>

        <div className="mixing-bowl">
          <motion.div
            className="mixing-pile"
            style={{ background: doughColor }}
            animate={{ scale: isEmpty ? 0 : fillScale }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          />
        </div>
      </div>

      <div className="ingredient-controls">
        <button onClick={() => handleAdd('flour')}>+100g Flour</button>
        <button onClick={() => handleAdd('water')}>+75g Water</button>
        <button onClick={() => handleAdd('yeast')}>+5g Yeast</button>
        <button onClick={() => handleAdd('salt')}>+2g Salt</button>
      </div>

      <div className="mixing-actions">
        <button className="reset-bowl-btn" onClick={resetMixing} disabled={isEmpty}>
          Reset Bowl
        </button>
        <button onClick={() => advanceStage('kneading')} disabled={batch.flourWeightGrams === 0}>
          Start Kneading
        </button>
      </div>
    </div>
  );
};
