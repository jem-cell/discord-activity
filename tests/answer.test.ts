import { describe, it, expect } from 'vitest';
import { generatePuzzle, checkAnswer, feedback } from '../src/shared/puzzle';

describe('answer checking', () => {
  it('accepts the correct answer', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    expect(checkAnswer(p, p.answer)).toBe(true);
  });

  it('rejects a wrong answer', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    expect(checkAnswer(p, p.answer + 1)).toBe(false);
  });

  it('tolerates small rounding differences for non-integer answers', () => {
    // Force a puzzle with a non-integer answer (modulus or percentage).
    // We just verify the tolerance path: a guess within 0.01 is accepted.
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const near = p.answer + 0.005;
    expect(checkAnswer(p, near)).toBe(true);
  });
});

describe('feedback', () => {
  it('reports correct on the right answer', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    expect(feedback(p, p.answer, 1).correct).toBe(true);
  });

  it('reports high when the guess is above the answer', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const f = feedback(p, p.answer + 5, 1);
    expect(f.correct).toBe(false);
    expect(f.warmCold).toBe('high');
  });

  it('reports low when the guess is below the answer', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const f = feedback(p, p.answer - 5, 1);
    expect(f.correct).toBe(false);
    expect(f.warmCold).toBe('low');
  });

  it('shows the method hint on the final try', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const f = feedback(p, p.answer + 5, 3);
    expect(f.hint).toBe(p.hint);
  });

  it('does not show the hint before the final try', () => {
    const p = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const f = feedback(p, p.answer + 5, 1);
    expect(f.hint).toBeNull();
  });
});
