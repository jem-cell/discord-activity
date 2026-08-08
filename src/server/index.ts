// Server entry point. Run with: npm run dev:server

import { createDb } from './db';
import { createApp } from './app';

const PORT = Number(process.env.PORT ?? 3000);
const DB_PATH = process.env.DB_PATH ?? './data.sqlite';

const db = createDb(DB_PATH);
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`Math game server listening on http://localhost:${PORT}`);
  console.log(`  GET  /api/puzzle?guild=<id>&user=<id>`);
  console.log(`  POST /api/guess  { guild, user, guess, tryNumber }`);
  console.log(`  GET  /api/leaderboard?guild=<id>`);
});
