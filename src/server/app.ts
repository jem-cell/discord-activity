// Express app: daily puzzle, guess/score, per-guild leaderboard.

import express from 'express';
import type { Db } from './db';
import { getResult, getCurrentStreak, recordResult, getLeaderboard } from './db';
import { generatePuzzle, feedback } from '../shared/puzzle';
import { score, updateStreak } from '../shared/scoring';

const MAX_TRIES = 3;

/** BST (UTC+1) date string for a given instant. */
export function bstDateString(date: Date): string {
  return new Date(date.getTime() + 3600_000).toISOString().slice(0, 10);
}

export interface AppOptions {
  now?: () => Date;
}

export function createApp(db: Db, options: AppOptions = {}) {
  const now = options.now ?? (() => new Date());
  const app = express();
  app.use(express.json());

  // Today's puzzle (no answer exposed).
  app.get('/api/puzzle', (req, res) => {
    const guild = String(req.query.guild ?? '');
    const user = String(req.query.user ?? '');
    const today = bstDateString(now());
    const puzzle = generatePuzzle(now());
    const alreadyPlayed = !!getResult(db, guild, user, today);
    res.json({
      day: puzzle.day,
      band: puzzle.band,
      type: puzzle.type,
      prompt: puzzle.prompt,
      tries: MAX_TRIES,
      alreadyPlayed,
    });
  });

  // Submit a guess. Records the result when the game ends (solve or 3 tries).
  app.post('/api/guess', (req, res) => {
    const { guild, user, guess, tryNumber } = req.body ?? {};
    if (typeof guild !== 'string' || typeof user !== 'string' || typeof guess !== 'number' || typeof tryNumber !== 'number') {
      return res.status(400).json({ error: 'invalid request' });
    }
    const today = bstDateString(now());
    if (getResult(db, guild, user, today)) {
      return res.status(403).json({ error: 'already played today' });
    }

    const puzzle = generatePuzzle(now());
    const fb = feedback(puzzle, guess, tryNumber);
    const gameOver = fb.correct || tryNumber >= MAX_TRIES;

    let points = 0;
    let streak = 0;
    if (gameOver) {
      const prevStreak = getCurrentStreak(db, guild, user);
      const solved = fb.correct;
      points = solved ? score(tryNumber, puzzle.band) : 0;
      streak = updateStreak(prevStreak, solved);
      recordResult(db, { guild_id: guild, user_id: user, date: today, tries: tryNumber, points, streak });
    }

    res.json({
      correct: fb.correct,
      warmCold: fb.warmCold,
      hint: fb.hint,
      solved: fb.correct,
      gameOver,
      points,
      streak,
    });
  });

  // Per-guild leaderboard.
  app.get('/api/leaderboard', (req, res) => {
    const guild = String(req.query.guild ?? '');
    res.json(getLeaderboard(db, guild, bstDateString(now())));
  });

  return app;
}
