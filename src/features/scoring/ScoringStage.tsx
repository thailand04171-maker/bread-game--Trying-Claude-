import React, { useRef, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 220;
const MIN_SLASH_DISTANCE = 15;
const MIN_LINES_TO_PROCEED = 2;

export const ScoringStage: React.FC = () => {
  const batch = useGameStore((s) => s.currentBatch);
  const addScoreLine = useGameStore((s) => s.addScoreLine);
  const advanceStage = useGameStore((s) => s.advanceStage);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!batch) return null;

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    startPoint.current = getCanvasPoint(e);
    setIsDrawing(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!startPoint.current) return;
    const end = getCanvasPoint(e);
    const start = startPoint.current;
    const distance = Math.hypot(end.x - start.x, end.y - start.y);

    if (distance >= MIN_SLASH_DISTANCE) {
      drawLine(start.x, start.y, end.x, end.y);
      addScoreLine({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
    }

    startPoint.current = null;
    setIsDrawing(false);
  };

  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Note: this only clears the visual canvas; scoreLines already recorded
    // in the store stay counted toward scoreDepth, matching a real loaf
    // where a re-slash doesn't undo the first cut.
  };

  const canProceed = batch.scoreLines.length >= MIN_LINES_TO_PROCEED;

  return (
    <div className="scoring-stage">
      <h2>Scoring</h2>
      <p>Slashes: {batch.scoreLines.length}</p>
      <p>Score Depth: {(batch.scoreDepth * 100).toFixed(0)}%</p>

      <div className="score-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={`score-canvas ${isDrawing ? 'drawing' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      </div>

      <p className="hint">Drag across the loaf to slash a score line</p>

      <div className="scoring-actions">
        <button onClick={handleClear} type="button">
          Clear Drawing
        </button>
        <button onClick={() => advanceStage('baking')} disabled={!canProceed}>
          Start Baking
        </button>
      </div>
    </div>
  );
};
