import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import type { ScreenView } from '../../types/game';
import { Modal } from '../common/Modal';

interface NavbarProps {
  view: ScreenView;
  onChangeView: (view: ScreenView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, onChangeView }) => {
  const coins = useGameStore((s) => s.coins);
  const reputation = useGameStore((s) => s.reputation);
  const currentBatch = useGameStore((s) => s.currentBatch);
  const discardBatch = useGameStore((s) => s.discardBatch);
  const resetGame = useGameStore((s) => s.resetGame);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const canCancelBatch = !!currentBatch && currentBatch.currentStage !== 'finished';

  return (
    <header className="hud-header">
      <h1>🍞 Artisan Bakery Studio</h1>
      <nav className="view-tabs">
        <button className={view === 'game' ? 'active' : ''} onClick={() => onChangeView('game')}>
          Bakery
        </button>
        <button
          className={view === 'recipes' ? 'active' : ''}
          onClick={() => onChangeView('recipes')}
        >
          Recipe Book
        </button>
        <button
          className={view === 'upgrades' ? 'active' : ''}
          onClick={() => onChangeView('upgrades')}
        >
          Upgrades
        </button>
      </nav>
      <div className="stats">
        <span>Coins: 💰 {coins}</span>
        <span>Reputation: ⭐ {reputation}</span>
        <span>Status: {currentBatch ? currentBatch.currentStage.toUpperCase() : 'IDLE'}</span>
        {canCancelBatch && (
          <button className="cancel-batch-btn" onClick={() => setConfirmCancelOpen(true)}>
            Cancel Batch
          </button>
        )}
        <button className="reset-data-btn" onClick={() => setConfirmResetOpen(true)}>
          Reset Progress
        </button>
      </div>

      <Modal
        isOpen={confirmCancelOpen}
        title="Cancel this batch?"
        confirmLabel="Yes, Discard It"
        cancelLabel="Keep Baking"
        danger
        onConfirm={() => {
          discardBatch();
          setConfirmCancelOpen(false);
        }}
        onCancel={() => setConfirmCancelOpen(false)}
      >
        <p>
          You'll lose the {currentBatch?.recipeName ?? 'current'} loaf and everything mixed into it so
          far. Ingredients already used will <strong>not</strong> be refunded.
        </p>
      </Modal>

      <Modal
        isOpen={confirmResetOpen}
        title="Reset all progress?"
        confirmLabel="Yes, Reset Everything"
        cancelLabel="Keep My Save"
        danger
        onConfirm={() => {
          resetGame();
          setConfirmResetOpen(false);
        }}
        onCancel={() => setConfirmResetOpen(false)}
      >
        <p>
          This wipes your coins, reputation, unlocked recipes, upgrades, pantry, and any batch in
          progress back to a brand-new save. This can't be undone — use it if you ever get stuck
          without enough coins or ingredients to keep playing.
        </p>
      </Modal>
    </header>
  );
};
