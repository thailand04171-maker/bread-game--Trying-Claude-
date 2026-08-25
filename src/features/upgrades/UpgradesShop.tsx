import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { UPGRADES } from '../../config/upgrades';

export const UpgradesShop: React.FC = () => {
  const coins = useGameStore((s) => s.coins);
  const purchasedUpgrades = useGameStore((s) => s.purchasedUpgrades);
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade);

  return (
    <div className="upgrades-shop">
      <h2>Bakery Upgrades</h2>
      <p className="hint">One-time purchases that make every future bake a little easier.</p>

      <div className="upgrade-grid">
        {UPGRADES.map((upgrade) => {
          const isOwned = purchasedUpgrades.includes(upgrade.id);
          return (
            <div key={upgrade.id} className={`upgrade-card ${isOwned ? 'owned' : ''}`}>
              <h4>{upgrade.name}</h4>
              <p>{upgrade.description}</p>
              {isOwned ? (
                <span className="owned-badge">Owned</span>
              ) : (
                <button
                  onClick={() => purchaseUpgrade(upgrade.id)}
                  disabled={coins < upgrade.cost}
                >
                  Buy (💰{upgrade.cost})
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
