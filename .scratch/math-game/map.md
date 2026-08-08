# Map: Discord Math Game

labels: wayfinder:map

## Destination

A spec for a **Discord Activity** (Embedded App SDK) math game, ready to hand off to a build. One shared daily puzzle at a fixed difficulty, ramping primary → A-level over days; Wordle-style tries; per-server leaderboard; midnight BST reset. See `SPEC.md`.

## Notes

- Domain: Discord Embedded App SDK (React), game design, difficulty calibration, leaderboard/backend.
- Skills to consult: `/grilling`, `/domain-modeling`, `/research`, `/prototype`.
- Standing preferences: test game logic before deploy; per-server leaderboard; BST midnight reset; shared daily puzzle.
- Tracker: local markdown under `.scratch/`.

## Decisions so far

<!-- one line per closed ticket -->

## Not yet specified

- Puzzle generation & answer-checking engine (how each puzzle type is generated and validated) — hangs on puzzle types + difficulty ramp.
- Difficulty calibration data (what "primary" vs "A-level" means concretely per topic) — hangs on puzzle types + ramp.
- How the Activity UI presents the puzzle and collects guesses — hangs on SDK research + game mechanics.
- Daily puzzle determinism (seeded per-day so everyone gets the same one) — hangs on backend + puzzle engine.

## Out of scope

- Global (cross-server) leaderboard.
- Adaptive per-user difficulty.
- Operator-set daily levels.
- Geometry / word-problem generation (likely deferred).
