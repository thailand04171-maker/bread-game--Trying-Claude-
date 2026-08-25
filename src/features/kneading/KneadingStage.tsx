import React, { useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { ProgressBar } from '../../components/common/ProgressBar';

const DISTANCE_TO_PROGRESS = 0.12;
const MIN_STROKE_DISTANCE = 20;
const MAX_PROGRESS_PER_STROKE = 14;

export const KneadingStage: React.FC = () => {
  const batch = useGameStore((s) => s.currentBatch);
  const updateKneadProgress = useGameStore((s) => s.updateKneadProgress);
  const advanceStage = useGameStore((s) => s.advanceStage);
  const [isDragging, setIsDragging] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  if (!batch) return null;

  const isReady = batch.glutenDevelopment >= 100;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < MIN_STROKE_DISTANCE) return;

    const progress = Math.min(MAX_PROGRESS_PER_STROKE, distance * DISTANCE_TO_PROGRESS);
    updateKneadProgress(progress);
    setStrokeCount((c) => c + 1);
  };

  return (
    <div className="kneading-stage">
      <h2>Kneading</h2>
      <p className="stroke-count">Strokes: {strokeCount}</p>

      <div className="knead-area">
        <motion.div
          className="dough-blob"
          drag
          dragElastic={0.5}
          dragMomentum={false}
          dragSnapToOrigin
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 0.82 }}
          animate={{ scale: isDragging ? 0.82 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>

      <p className="hint">Pull and release the dough to build gluten</p>

      <ProgressBar value={batch.glutenDevelopment} label="Gluten Development" />

      <button onClick={() => advanceStage('proofing')} disabled={!isReady}>
        Start Proofing
      </button>
    </div>
  );
};
