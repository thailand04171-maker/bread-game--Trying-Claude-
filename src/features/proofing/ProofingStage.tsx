import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { ProgressBar } from '../../components/common/ProgressBar';

export const ProofingStage: React.FC = () => {
  const batch = useGameStore((s) => s.currentBatch);
  const advanceStage = useGameStore((s) => s.advanceStage);

  if (!batch) return null;

  const percentDone = (batch.elapsedProofTime / batch.targetProofTime) * 100;
  // Clamp the visual growth so an over-proofed loaf doesn't blow out of the bowl.
  const visualScale = Math.min(1.9, batch.volumeMultiplier);

  return (
    <div className="proofing-stage">
      <h2>Proofing</h2>
      <p>
        Elapsed: {batch.elapsedProofTime.toFixed(1)}s / {batch.targetProofTime}s
      </p>
      <p>Volume: {batch.volumeMultiplier.toFixed(2)}x</p>

      <div className="proof-visual">
        <div className="proof-bowl" />
        <motion.div
          className="proof-dough"
          animate={{ scale: visualScale }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        >
          <motion.div
            className="proof-dough-sheen"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="proof-bubble"
            style={{ left: `${20 + i * 18}%` }}
            animate={{ y: [-4, -50], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <ProgressBar value={percentDone} label="Proof Progress" color="#8fbf6f" />

      <button
        onClick={() => advanceStage('scoring')}
        disabled={batch.elapsedProofTime < batch.targetProofTime}
      >
        Move to Scoring
      </button>
    </div>
  );
};
