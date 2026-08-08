// Scoring & streak logic. Pure functions, no I/O.

import type { Band } from './puzzle';

// Harder bands are worth more. primary=1 … a-level=5.
export const BAND_MULTIPLIER: Record<Band, number> = {
  primary: 1,
  ks3: 2,
  gcse: 3,
  as: 4,
  'a-level': 5,
};

/**
 * Points for a solve. tries is 1..3 (0 = failed day). Formula:
 * (4 - tries) × band multiplier. A failed day scores 0.
 */
export function score(tries: number, band: Band): number {
  if (tries <= 0) return 0;
  const base = 4 - Math.min(tries, 3);
  return base * BAND_MULTIPLIER[band];
}

/** Next streak value: +1 on a solve, reset to 0 on a fail. */
export function updateStreak(prevStreak: number, solved: boolean): number {
  return solved ? prevStreak + 1 : 0;
}
