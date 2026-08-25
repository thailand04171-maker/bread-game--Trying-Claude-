import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { ProgressBar } from '../../components/common/ProgressBar';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
    .join('')}`;

// 0 -> pale raw dough, 100 -> golden brown, 130+ -> burnt.
const crustColor = (doneness: number) => {
  const pale = hexToRgb('#f3e2c7');
  const golden = hexToRgb('#c99a5b');
  const burnt = hexToRgb('#3a2412');

  if (doneness <= 100) {
    const t = doneness / 100;
    const [r, g, b] = pale.map((v, i) => lerp(v, golden[i], t));
    return rgbToHex(r, g, b);
  }
  const t = Math.min(1, (doneness - 100) / 30);
  const [r, g, b] = golden.map((v, i) => lerp(v, burnt[i], t));
  return rgbToHex(r, g, b);
};

export const BakingStage: React.FC = () => {
  const batch = useGameStore((s) => s.currentBatch);
  const finishBatch = useGameStore((s) => s.finishBatch);

  if (!batch) return null;

  const isBurning = batch.crustDoneness > 120;
  const loafColor = crustColor(batch.crustDoneness);

  return (
    <div className="baking-stage">
      <h2>Baking</h2>
      <p>Oven Temp: {batch.ovenTempC}°C</p>
      <p>Crust Doneness: {batch.crustDoneness.toFixed(0)}%</p>
      {isBurning && <p className="warning">The crust is burning — pull it now!</p>}

      <div className={`oven-visual ${isBurning ? 'burning' : ''}`}>
        <div className="oven-glow" />
        <motion.div
          className="oven-loaf"
          style={{ background: loafColor }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="oven-steam"
            style={{ left: `${35 + i * 12}%` }}
            animate={{ y: [-10, -60], opacity: [0, 0.5, 0], x: [0, i % 2 === 0 ? 8 : -8, 0] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
          />
        ))}
      </div>

      <ProgressBar
        value={batch.crustDoneness}
        label="Crust Doneness"
        color={isBurning ? '#c0392b' : '#d8a15c'}
      />

      <button onClick={finishBatch} disabled={batch.crustDoneness < 90}>
        Pull From Oven
      </button>
    </div>
  );
};
