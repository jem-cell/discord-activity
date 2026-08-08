// SQLite persistence via node:sqlite (no native build needed).
// Loaded via createRequire so Vite's ESM resolver doesn't try to bundle it.

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as typeof import('node:sqlite');

export interface ScoreRow {
  guild_id: string;
  user_id: string;
  date: string;
  tries: number;
  points: number;
  streak: number;
}

export type Db = InstanceType<typeof DatabaseSync>;

export function createDb(path: string): Db {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      tries INTEGER NOT NULL,
      points INTEGER NOT NULL,
      streak INTEGER NOT NULL,
      PRIMARY KEY (guild_id, user_id, date)
    );
  `);
  return db;
}

/** The result row for a user in a guild on a given date, if any. */
export function getResult(db: Db, guild: string, user: string, date: string): ScoreRow | undefined {
  return db
    .prepare('SELECT * FROM scores WHERE guild_id = ? AND user_id = ? AND date = ?')
    .get(guild, user, date) as ScoreRow | undefined;
}

/** The user's current streak = streak of their most recent result in the guild. */
export function getCurrentStreak(db: Db, guild: string, user: string): number {
  const row = db
    .prepare('SELECT streak FROM scores WHERE guild_id = ? AND user_id = ? ORDER BY date DESC LIMIT 1')
    .get(guild, user) as { streak: number } | undefined;
  return row?.streak ?? 0;
}

export function recordResult(db: Db, row: ScoreRow): void {
  db.prepare(
    `INSERT INTO scores (guild_id, user_id, date, tries, points, streak)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(row.guild_id, row.user_id, row.date, row.tries, row.points, row.streak);
}

export interface LeaderboardEntry {
  user: string;
  points: number;
  streak: number;
  solvedToday: boolean;
}

/** Per-guild leaderboard: total points, current streak, solved-today marker. */
export function getLeaderboard(db: Db, guild: string, today: string): LeaderboardEntry[] {
  const rows = db
    .prepare(
      `SELECT user_id,
              SUM(points) AS points,
              MAX(date) AS last_date
       FROM scores
       WHERE guild_id = ?
       GROUP BY user_id
       ORDER BY points DESC`
    )
    .all(guild) as { user_id: string; points: number; last_date: string }[];

  return rows.map((r) => {
    const latest = db
      .prepare('SELECT streak, points FROM scores WHERE guild_id = ? AND user_id = ? AND date = ?')
      .get(guild, r.user_id, r.last_date) as { streak: number; points: number } | undefined;
    const todayRow = getResult(db, guild, r.user_id, today);
    return {
      user: r.user_id,
      points: r.points,
      streak: latest?.streak ?? 0,
      solvedToday: todayRow ? todayRow.points > 0 : false,
    };
  });
}
