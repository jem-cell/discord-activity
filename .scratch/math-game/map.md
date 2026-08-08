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

## Live tickets

- [Research: Embedded App SDK mechanics](https://github.com/jem-cell/discord-activity/issues/3) — unblocked
- [Grilling: Puzzle types & difficulty ramp](https://github.com/jem-cell/discord-activity/issues/4) — unblocked
- [Grilling: Game mechanics & scoring](https://github.com/jem-cell/discord-activity/issues/5) — blocked by #4
- [Grilling: Backend & data architecture](https://github.com/jem-cell/discord-activity/issues/6) — blocked by #3
- [Grilling: Testing strategy](https://github.com/jem-cell/discord-activity/issues/7) — blocked by #5

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
