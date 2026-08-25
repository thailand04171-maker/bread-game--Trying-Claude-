import type { FlourType } from '../types/bread';

export interface FlourTypeConfig {
  id: FlourType;
  label: string;
  description: string;
  proteinPercent: number; // affects gluten development rate
  color: string; // UI swatch color
}

export const FLOUR_TYPES: Record<FlourType, FlourTypeConfig> = {
  all_purpose: {
    id: 'all_purpose',
    label: 'All-Purpose Flour',
    description: 'A versatile flour with moderate protein content. Forgiving for beginners.',
    proteinPercent: 10,
    color: '#f3e2c7',
  },
  bread_flour: {
    id: 'bread_flour',
    label: 'Bread Flour',
    description: 'High-protein flour that develops strong gluten structure for chewy loaves.',
    proteinPercent: 13,
    color: '#e8d0a0',
  },
  whole_wheat: {
    id: 'whole_wheat',
    label: 'Whole Wheat Flour',
    description: 'Dense, nutty flour milled from the whole grain. Absorbs more water.',
    proteinPercent: 14,
    color: '#c99a5b',
  },
  rye: {
    id: 'rye',
    label: 'Rye Flour',
    description: 'Low-gluten flour with a distinct tang. Requires careful hydration.',
    proteinPercent: 8,
    color: '#8a6a45',
  },
};

export const FLOUR_TYPE_LIST = Object.values(FLOUR_TYPES);
