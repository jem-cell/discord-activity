# Discord Math Game — Spec

> **Status: ready to hand off to a build.** All decisions resolved via the wayfinding map (see `docs/` and the GitHub issues). This is the destination.

## What it is

A **Discord Activity** (Embedded App SDK) math game that runs inside a voice call. Each day there is **one shared puzzle** at a fixed difficulty; difficulty ramps over days from **primary school** up to **A-level**. Players get **3 Wordle-style tries**, and a **per-server leaderboard** tracks results. The daily puzzle resets at **midnight BST**.

## Architecture

- **Activity (client)**: a React SPA (Vite) hosted in an iframe inside Discord, using `@discord/embedded-app-sdk` over postMessage.
- **Backend**: Node.js + Express. Serves the app, handles OAuth token exchange, serves the daily puzzle, stores scores, computes the per-server leaderboard.
- **Database**: SQLite (single file).
- **Networking**: the Activity is sandboxed via Discord's proxy; the backend is reached through a **URL Mapping** (e.g. `/api` → backend host). The Activity identifies the guild/channel via the SDK/API (enables per-server leaderboard).
- **Hosting**: deferred to build time. Requirement: a **public HTTPS** URL for the app + backend (for the URL Mapping), ideally a **static egress IP** for the backend (dynamic cloud-function IPs risk Cloudflare bans on Discord API egress).

## Daily puzzle

- **One shared puzzle per day**, identical for everyone.
- **Deterministic**: generated from a seed derived from the **BST date** (e.g. `YYYY-MM-DD`). No midnight job needed.
- **Difficulty ramp**: linear over **30 days**, split into **5 bands** (6 days each), then plateaus at A-level:

| Band | Days (of 30) | Curriculum |
|---|---|---|
| Primary | 1–6 | KS1–KS2 |
| KS3 | 7–12 | lower secondary |
| GCSE | 13–18 | GCSE |
| AS | 19–24 | A-level year 1 |
| A-level | 25–30 | A-level year 2 |

- The band is derived from the day number; the puzzle is generated from that band's templates.

## Puzzle types (v1)

Three types, in rotation: **arithmetic**, **algebra**, **sequences**. Question templates per topic × band are in `docs/design/puzzle-calibration.md` (first pass — refine during testing).

## Game mechanics

- **3 tries** per puzzle.
- **Warm-cold feedback** between tries (too high/low, or close/not close).
- A **method hint** is shown on the final try.
- **Fail** (no correct answer in 3 tries) = no points, streak resets to 0.

## Scoring & leaderboard

- **Points** are tries-based, × a band multiplier:
  - 1 try = 3 pts, 2 tries = 2 pts, 3 tries = 1 pt, × band multiplier.
- **Streak**: consecutive days solved.
- **Per-server leaderboard**, ranked by points, showing each player's **points + streak + a "solved today" marker**.
- **Data model**: a `scores` table — `(guild_id, user_id, date, tries, points, streak)`. Leaderboard = query per guild.

## Testing

- **Vitest** unit tests on the **puzzle engine + backend logic**: generation, calibration, answer-checking, scoring/streak, daily-puzzle seed determinism, leaderboard queries, BST reset.
- The React UI is thin (display + input) and is tested by running it, not unit-tested.
- **Live test**: a dev-only Discord application + a `cloudflared` tunnel (`cloudflared tunnel --url http://localhost:3000`), launched from the Activity Shelf (Rocket button) in a voice channel with Developer Mode enabled.

## Out of scope (v1)

- Global (cross-server) leaderboard.
- Adaptive per-user difficulty.
- Operator-set daily levels.
- Geometry / word-problem generation.

## Supporting docs

- `docs/research/embedded-app-sdk.md` — how Discord Activities work (sources).
- `docs/design/puzzle-calibration.md` — question templates per topic × band.
