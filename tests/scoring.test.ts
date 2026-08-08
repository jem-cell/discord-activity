import { describe, it, expect } from 'vitest';
import { score, updateStreak, BAND_MULTIPLIER } from '../src/shared/scoring';

describe('scoring', () => {
  it('awards fewer points for more tries', () => {
    expect(score(1, 'primary')).toBe(3);
    expect(score(2, 'primary')).toBe(2);
    expect(score(3, 'primary')).toBe(1);
  });

  it('weights harder bands more', () => {
    expect(score(1, 'a-level')).toBe(3 * BAND_MULTIPLIER['a-level']);
    expect(score(1, 'a-level')).toBeGreaterThan(score(1, 'primary'));
  });

  it('awards zero for a failed day (no solve)', () => {
    expect(score(0, 'primary')).toBe(0);
  });
});

describe('streak', () => {
  it('increments on a solve', () => {
    expect(updateStreak(0, true)).toBe(1);
    expect(updateStreak(5, true)).toBe(6);
  });

  it('resets to zero on a fail', () => {
    expect(updateStreak(5, false)).toBe(0);
  });
});
