// End-to-end demo of the game backend. Run: npm run demo
// Uses an in-memory DB and a fixed clock so the output is reproducible.

import request from 'supertest';
import { createApp } from '../src/server/app';
import { createDb } from '../src/server/db';
import { generatePuzzle } from '../src/shared/puzzle';

const NOW = new Date('2026-08-10T12:00:00Z');
const db = createDb(':memory:');
const app = createApp(db, { now: () => NOW });

const log = (label: string, value: unknown) => {
  console.log(`\n── ${label} ──`);
  console.log(JSON.stringify(value, null, 2));
};

const main = async () => {
  const puzzle = generatePuzzle(NOW);
  console.log('Today\'s puzzle (demo shows the answer; the real API hides it):');
  console.log(`  [day ${puzzle.day} · ${puzzle.band} · ${puzzle.type}] ${puzzle.prompt}  →  ${puzzle.answer}`);

  // 1. Fetch the puzzle via the API (no answer exposed).
  const puzzleRes = await request(app).get('/api/puzzle?guild=g1&user=u1');
  log('GET /api/puzzle', puzzleRes.body);

  // 2. A wrong guess → warm-cold feedback.
  const wrong = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: puzzle.answer + 5, tryNumber: 1 });
  log('POST /api/guess (wrong)', wrong.body);

  // 3. The correct guess → solved, points, streak.
  const right = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: puzzle.answer, tryNumber: 2 });
  log('POST /api/guess (correct)', right.body);

  // 4. Once-a-day rule → 403 on a second game.
  const again = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: puzzle.answer, tryNumber: 1 });
  log('POST /api/guess (again → 403)', { status: again.status, body: again.body });

  // 5. A second user fails today.
  await request(app).post('/api/guess').send({ guild: 'g1', user: 'u2', guess: puzzle.answer + 100, tryNumber: 3 });

  // 6. Per-guild leaderboard.
  const board = await request(app).get('/api/leaderboard?guild=g1');
  log('GET /api/leaderboard?guild=g1', board.body);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
