import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = '#d8a15c', label }) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar">
      {label && <div className="progress-bar-label">{label}</div>}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${clamped}%`, background: color }} />
      </div>
    </div>
  );
};
