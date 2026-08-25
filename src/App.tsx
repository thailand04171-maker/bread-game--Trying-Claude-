import React, { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { useGameLoop } from './hooks/useGameLoop';
import { Navbar } from './components/layout/Navbar';
import { MixingStage } from './features/mixing/MixingStage';
import { KneadingStage } from './features/kneading/KneadingStage';
import { ProofingStage } from './features/proofing/ProofingStage';
import { ScoringStage } from './features/scoring/ScoringStage';
import { BakingStage } from './features/baking/BakingStage';
import { RecipeSelect } from './features/bakery/RecipeSelect';
import { InventoryPanel } from './features/bakery/InventoryPanel';
import { CustomerQueue } from './features/bakery/CustomerQueue';
import { UpgradesShop } from './features/upgrades/UpgradesShop';
import { RecipeBook } from './features/bakery/RecipeBook';
import type { ScreenView } from './types/game';
import './App.css';

export const App: React.FC = () => {
  useGameLoop();

  const currentBatch = useGameStore((s) => s.currentBatch);
  const [view, setView] = useState<ScreenView>('game');

  return (
    <div className="game-container">
      <Navbar view={view} onChangeView={setView} />

      {view === 'upgrades' ? (
        <UpgradesShop />
      ) : view === 'recipes' ? (
        <RecipeBook />
      ) : (
        <div className="game-body">
          <main className="game-viewport">
            {!currentBatch && <RecipeSelect />}

            {currentBatch?.currentStage === 'mixing' && <MixingStage />}
            {currentBatch?.currentStage === 'kneading' && <KneadingStage />}
            {currentBatch?.currentStage === 'proofing' && <ProofingStage />}
            {currentBatch?.currentStage === 'scoring' && <ScoringStage />}
            {currentBatch?.currentStage === 'baking' && <BakingStage />}
            {currentBatch?.currentStage === 'finished' && (
              <div className="results-modal">
                <h2>Bread Completed!</h2>
                <p>Quality Score: {currentBatch.finalQualityScore}/100</p>
                <p>Earned: 💰 {currentBatch.estimatedValue}</p>
                <p className="hint">Serve a waiting customer from the sidebar, or start a fresh bake.</p>
                <button onClick={() => useGameStore.getState().discardBatch()}>Next Loaf</button>
              </div>
            )}
          </main>

          <aside className="game-sidebar">
            <InventoryPanel />
            <CustomerQueue />
          </aside>
        </div>
      )}
    </div>
  );
};

export default App;
