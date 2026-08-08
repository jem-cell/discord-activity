# Discord Math Game — Spec

> **Status: draft.** This is the destination this effort is charting toward. Decided items are locked; open items are marked and resolved via the wayfinding map (see `.scratch/`).

## What it is

A **Discord Activity** (Embedded App SDK) math game that runs inside a voice call. Each day there is **one shared puzzle** at a fixed difficulty; difficulty ramps over days from **primary school** up to **A-level**. Players get a **Wordle-style** set of tries, and a **per-server leaderboard** tracks results. The daily puzzle resets at **midnight BST**.

## Decided

- **Platform**: Discord Activity via the **Embedded App SDK** (runs inside a voice/video call, launched from an Activity URL). Not a plain embed-message bot.
- **Daily puzzle**: one shared question for everyone each day, at a fixed difficulty for that day.
- **Difficulty progression**: fixed schedule that ramps primary → A-level over days (exact curve TBD).
- **Puzzle variety**: multiple puzzle types in rotation (exact set TBD).
- **Leaderboard**: **per-server**.
- **Daily reset**: **midnight BST**.
- **Testing**: test game logic before deploy.

## Open questions (resolved via wayfinding tickets)

- **Puzzle types** — which types are in the first rotation (arithmetic / algebra / sequences / geometry / word problems / number-order)?
- **Difficulty ramp curve** — how many days per level, and how the ramp plateaus at A-level.
- **Tries & feedback** — how many tries, and what feedback between tries (warm-cold, hints, etc.).
- **Scoring** — what ranks players on the leaderboard (points, streak, time, combination).
- **Backend & hosting** — where the daily puzzle, scoreboard, and BST reset live (deferred until the SDK's requirements are researched).
- **Testing approach** — unit tests on the puzzle engine, a local dev Activity, or both.

## Non-goals (out of scope for v1)

- Global (cross-server) leaderboard.
- Adaptive per-user difficulty.
- Operator-set daily levels.
- Geometry / word-problem generation (likely deferred).
