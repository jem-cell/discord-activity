# Discord Math Game — testable core

The pure puzzle engine + backend API for the Discord math game. The React Activity client and live-test setup are out of scope for this session (see `SPEC.md`).

## Structure

- `src/shared/puzzle.ts` — pure puzzle engine: daily determinism, difficulty ramp (5 bands, 30 days), generation, answer-checking, feedback.
- `src/shared/scoring.ts` — points + streak logic.
- `src/server/db.ts` — SQLite persistence (`node:sqlite`, no native build).
- `src/server/app.ts` — Express app: daily puzzle, guess/score, per-guild leaderboard.
- `src/server/index.ts` — runnable server entry point.
- `tests/` — Vitest tests at the agreed seams.

## Run

```bash
npm install
npm run dev:server        # starts on http://localhost:3000
```

## Test

```bash
npm test                  # full suite
npm run typecheck
```

## API

- `GET /api/puzzle?guild=<id>&user=<id>` — today's puzzle (no answer), plus `alreadyPlayed`.
- `POST /api/guess` — body `{ guild, user, guess, tryNumber }` — warm-cold feedback; records the result on solve or after 3 tries; enforces once-a-day.
- `GET /api/leaderboard?guild=<id>` — per-guild ranking: points, streak, solved-today.

## Design notes

- Daily puzzle is **seeded by BST date** — deterministic, no midnight job. Band derived from day number since `LAUNCH_DATE` (2026-08-08), 6 days per band, plateau at A-level after day 30.
- Points: `(4 − tries) × band multiplier` (primary=1 … a-level=5). Fail = 0 points, streak resets.
- The `scores` table: `(guild_id, user_id, date, tries, points, streak)`.
