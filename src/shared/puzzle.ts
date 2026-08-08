// Pure puzzle engine: daily determinism, difficulty ramp, generation.
// No I/O, no framework — fully unit-testable.

export const BANDS = ['primary', 'ks3', 'gcse', 'as', 'a-level'] as const;
export type Band = (typeof BANDS)[number];

export const PUZZLE_TYPES = ['arithmetic', 'algebra', 'sequences'] as const;
export type PuzzleType = (typeof PUZZLE_TYPES)[number];

export interface Puzzle {
  day: number;
  band: Band;
  type: PuzzleType;
  prompt: string;
  answer: number;
  hint: string;
}

// Day 1 of the ramp. The daily puzzle is seeded by the BST date, and the
// band is derived from the number of days since this launch date.
export const LAUNCH_DATE = '2026-08-08';

const DAYS_PER_BAND = 6;

/** Number of days since launch (1-based), computed in BST (UTC+1). */
export function dayNumber(date: Date): number {
  const bst = new Date(date.getTime() + 3600_000);
  const bstDate = bst.toISOString().slice(0, 10);
  const launch = new Date(`${LAUNCH_DATE}T00:00:00Z`);
  const current = new Date(`${bstDate}T00:00:00Z`);
  const days = Math.floor((current.getTime() - launch.getTime()) / 86_400_000);
  return Math.max(1, days + 1);
}

/** Band for a given day number; plateaus at A-level after day 30. */
export function bandForDay(day: number): Band {
  const idx = Math.min(Math.floor((day - 1) / DAYS_PER_BAND), BANDS.length - 1);
  return BANDS[idx];
}

/** Stable 32-bit seed from a date string. */
function hashDate(date: Date): number {
  const bst = new Date(date.getTime() + 3600_000);
  const s = bst.toISOString().slice(0, 10);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

// --- Template generators. Each returns { prompt, answer, hint }. ---

type Template = (rng: () => number) => { prompt: string; answer: number; hint: string };

const arithmeticTemplates: Record<Band, Template[]> = {
  primary: [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is ${a} + ${b}?`, answer: a + b, hint: 'Add the two numbers together.' };
    },
    (r) => {
      const a = randInt(r, 2, 12);
      const b = randInt(r, 2, 12);
      return { prompt: `What is ${a} × ${b}?`, answer: a * b, hint: 'Use your times tables.' };
    },
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is ${a} − ${b}?`, answer: a - b, hint: 'Subtract the smaller from the larger.' };
    },
  ],
  ks3: [
    (r) => {
      const a = randInt(r, 12, 30);
      const b = randInt(r, 12, 30);
      return { prompt: `What is ${a} × ${b}?`, answer: a * b, hint: 'Multiply the two numbers.' };
    },
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is ${a}²?`, answer: a * a, hint: 'Square the number (multiply it by itself).' };
    },
    (r) => {
      const p = randInt(r, 10, 90);
      const a = randInt(r, 2, 9);
      return { prompt: `What is ${p}% of ${a * 10}?`, answer: (p / 100) * a * 10, hint: 'Find the percentage of the amount.' };
    },
  ],
  gcse: [
    (r) => {
      const a = randInt(r, 2, 12);
      return { prompt: `What is √${a * a}?`, answer: a, hint: 'Find the square root.' };
    },
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is ${a} × 10^${b}?`, answer: a * 10 ** b, hint: 'Multiply by the power of ten.' };
    },
  ],
  as: [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is log_${a}(${a ** b})?`, answer: b, hint: 'The log is the exponent you raise the base to.' };
    },
  ],
  'a-level': [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `What is |${a} + ${b}i|?`, answer: Math.sqrt(a * a + b * b), hint: 'The modulus is the square root of a² + b².' };
    },
  ],
};

const algebraTemplates: Record<Band, Template[]> = {
  primary: [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `Solve: x + ${a} = ${a + b}`, answer: b, hint: 'Subtract the constant from both sides.' };
    },
  ],
  ks3: [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      const c = randInt(r, 2, 9);
      return { prompt: `Solve: ${a}x + ${b} = ${a * c + b}`, answer: c, hint: 'Subtract the constant, then divide by the coefficient.' };
    },
  ],
  gcse: [
    (r) => {
      const a = randInt(r, 2, 9);
      return { prompt: `Solve: x² = ${a * a}`, answer: a, hint: 'Take the positive square root.' };
    },
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      const c = randInt(r, 2, 9);
      return { prompt: `Solve: ${a}x + ${b} = ${a * c + b}`, answer: c, hint: 'Rearrange to isolate x.' };
    },
  ],
  as: [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `Solve: log_${a}(x) = ${b}`, answer: a ** b, hint: 'Raise the base to the power on the right.' };
    },
  ],
  'a-level': [
    (r) => {
      const a = randInt(r, 2, 9);
      const b = randInt(r, 2, 9);
      return { prompt: `Solve: x² + ${a + b}x + ${a * b} = 0 (positive root)`, answer: -a, hint: 'Factorise the quadratic.' };
    },
  ],
};

const sequenceTemplates: Record<Band, Template[]> = {
  primary: [
    (r) => {
      const start = randInt(r, 1, 5);
      const d = randInt(r, 2, 5);
      const terms = [start, start + d, start + 2 * d, start + 3 * d];
      return { prompt: `What is the next term: ${terms.join(', ')}, …?`, answer: start + 4 * d, hint: 'Find the common difference.' };
    },
  ],
  ks3: [
    (r) => {
      const start = randInt(r, 1, 10);
      const d = randInt(r, 3, 9);
      const terms = [start, start + d, start + 2 * d, start + 3 * d];
      return { prompt: `What is the next term: ${terms.join(', ')}, …?`, answer: start + 4 * d, hint: 'Add the common difference.' };
    },
  ],
  gcse: [
    (r) => {
      const a = randInt(r, 2, 4);
      const r2 = randInt(r, 2, 3);
      const terms = [a, a * r2, a * r2 ** 2, a * r2 ** 3];
      return { prompt: `What is the next term: ${terms.join(', ')}, …?`, answer: a * r2 ** 4, hint: 'Multiply by the common ratio.' };
    },
  ],
  as: [
    (r) => {
      const a = randInt(r, 1, 5);
      const d = randInt(r, 2, 5);
      const n = randInt(r, 4, 8);
      const sum = (n / 2) * (2 * a + (n - 1) * d);
      return { prompt: `What is the sum of the first ${n} terms of the arithmetic sequence starting ${a}, ${a + d}, …?`, answer: sum, hint: 'Use the arithmetic series sum formula.' };
    },
  ],
  'a-level': [
    (r) => {
      const a = randInt(r, 1, 3);
      const d = randInt(r, 2, 4);
      const n = randInt(r, 3, 6);
      const sum = (n / 2) * (2 * a + (n - 1) * d);
      return { prompt: `What is the sum of the first ${n} terms of the arithmetic sequence starting ${a}, ${a + d}, …?`, answer: sum, hint: 'Use the arithmetic series sum formula.' };
    },
  ],
};

const templatesByType: Record<PuzzleType, Record<Band, Template[]>> = {
  arithmetic: arithmeticTemplates,
  algebra: algebraTemplates,
  sequences: sequenceTemplates,
};

/** Generate today's puzzle deterministically from the date. */
export function generatePuzzle(date: Date): Puzzle {
  const day = dayNumber(date);
  const band = bandForDay(day);
  const rng = mulberry32(hashDate(date));

  const type = PUZZLE_TYPES[randInt(rng, 0, PUZZLE_TYPES.length - 1)];
  const pool = templatesByType[type][band];
  const template = pool[randInt(rng, 0, pool.length - 1)];
  const { prompt, answer, hint } = template(rng);

  return { day, band, type, prompt, answer, hint };
}

const TOLERANCE = 0.01;

/** Whether a guess matches the puzzle's answer (within tolerance). */
export function checkAnswer(puzzle: Puzzle, guess: number): boolean {
  return Math.abs(puzzle.answer - guess) <= TOLERANCE;
}

export interface Feedback {
  correct: boolean;
  warmCold: 'high' | 'low' | null;
  hint: string | null;
}

/** Wordle-style feedback for a guess on a given try (1-based). */
export function feedback(puzzle: Puzzle, guess: number, tryNumber: number): Feedback {
  if (checkAnswer(puzzle, guess)) {
    return { correct: true, warmCold: null, hint: null };
  }
  const warmCold = guess > puzzle.answer ? 'high' : 'low';
  const hint = tryNumber >= 3 ? puzzle.hint : null;
  return { correct: false, warmCold, hint };
}
