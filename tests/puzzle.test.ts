import { describe, it, expect } from 'vitest';
import { generatePuzzle, bandForDay, dayNumber, BANDS } from '../src/shared/puzzle';

describe('puzzle engine — daily determinism', () => {
  it('generates the same puzzle for the same date', () => {
    const a = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const b = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    expect(a).toEqual(b);
  });

  it('generates different puzzles for different dates', () => {
    const a = generatePuzzle(new Date('2026-08-10T12:00:00Z'));
    const b = generatePuzzle(new Date('2026-08-11T12:00:00Z'));
    expect(a.prompt).not.toBe(b.prompt);
  });
});

describe('puzzle engine — difficulty ramp', () => {
  it('maps day numbers to the 5 bands, 6 days each', () => {
    expect(bandForDay(1)).toBe('primary');
    expect(bandForDay(6)).toBe('primary');
    expect(bandForDay(7)).toBe('ks3');
    expect(bandForDay(12)).toBe('ks3');
    expect(bandForDay(13)).toBe('gcse');
    expect(bandForDay(18)).toBe('gcse');
    expect(bandForDay(19)).toBe('as');
    expect(bandForDay(24)).toBe('as');
    expect(bandForDay(25)).toBe('a-level');
    expect(bandForDay(30)).toBe('a-level');
  });

  it('plateaus at A-level after day 30', () => {
    expect(bandForDay(31)).toBe('a-level');
    expect(bandForDay(100)).toBe('a-level');
  });

  it('derives the band from the launch date', () => {
    // day 1 = launch date
    expect(dayNumber(new Date('2026-08-08T12:00:00Z'))).toBe(1);
    expect(bandForDay(dayNumber(new Date('2026-08-08T12:00:00Z')))).toBe('primary');
  });

  it('exposes the 5 band names in order', () => {
    expect(BANDS).toEqual(['primary', 'ks3', 'gcse', 'as', 'a-level']);
  });
});
