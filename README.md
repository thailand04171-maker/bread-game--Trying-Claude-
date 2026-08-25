# Bread Game

This project is just my attempt to use Claude in a project.

It's a small web-based bread-baking simulation game, built with React, TypeScript, Zustand, and Framer Motion. You mix, knead, proof, score, and bake a loaf, then sell it to customers who stop by the bakery.

## Stack

- React + TypeScript (Vite)
- Zustand for state management, with persistence to local storage
- Framer Motion for animation (dough rising, baking, mixing bowl, etc.)

## Running it

```
npm install
npm run dev
```

Then open the local URL Vite prints in your browser.

## Structure

- `src/store` - the Zustand game store and its logic
- `src/features` - the mixing, kneading, proofing, scoring, baking, bakery, and upgrades screens
- `src/config` - recipes, flour types, and upgrades data
- `src/types` - shared TypeScript types
