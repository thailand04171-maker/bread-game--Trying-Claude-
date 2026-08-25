import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const SPAWN_INTERVAL_MIN = 12;
const SPAWN_INTERVAL_MAX = 22;

export const useGameLoop = () => {
  const tickProofing = useGameStore((s) => s.tickProofing);
  const tickBaking = useGameStore((s) => s.tickBaking);
  const spawnCustomer = useGameStore((s) => s.spawnCustomer);
  const currentStage = useGameStore((s) => s.currentBatch?.currentStage);
  const hasDisplayCase = useGameStore((s) => s.purchasedUpgrades.includes('display_case'));

  const lastTimeRef = useRef<number>(performance.now());
  const nextSpawnInRef = useRef<number>(
    SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN)
  );

  useEffect(() => {
    let animFrameId: number;

    const tick = (now: number) => {
      const deltaSeconds = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (currentStage === 'proofing') {
        tickProofing(deltaSeconds);
      } else if (currentStage === 'baking') {
        tickBaking(deltaSeconds);
      }

      nextSpawnInRef.current -= deltaSeconds;
      if (nextSpawnInRef.current <= 0) {
        spawnCustomer();
        // Display Case draws in customers more often.
        const spawnScale = hasDisplayCase ? 0.7 : 1;
        nextSpawnInRef.current =
          (SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN)) * spawnScale;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [currentStage, tickProofing, tickBaking, spawnCustomer, hasDisplayCase]);
};
