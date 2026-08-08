import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/server/app';
import { createDb } from '../src/server/db';
import { generatePuzzle } from '../src/shared/puzzle';

const NOW = new Date('2026-08-10T12:00:00Z'); // a fixed "today"

function makeApp() {
  const db = createDb(':memory:');
  const app = createApp(db, { now: () => NOW });
  return { app, db };
}

describe('GET /api/puzzle', () => {
  it('returns today\'s puzzle without the answer', async () => {
    const { app } = makeApp();
    const res = await request(app).get('/api/puzzle?guild=g1&user=u1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ day: expect.any(Number), band: expect.any(String), type: expect.any(String), prompt: expect.any(String), tries: 3 });
    expect(res.body.answer).toBeUndefined();
    expect(res.body.alreadyPlayed).toBe(false);
  });

  it('marks alreadyPlayed when the user has a result today', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    const res = await request(app).get('/api/puzzle?guild=g1&user=u1');
    expect(res.body.alreadyPlayed).toBe(true);
  });
});

describe('POST /api/guess', () => {
  it('returns correct feedback and records a score on a solve', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    const res = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.solved).toBe(true);
    expect(res.body.points).toBeGreaterThan(0);
    expect(res.body.streak).toBe(1);
  });

  it('returns warm-cold feedback on a wrong guess', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    const wrong = p.answer + 5;
    const res = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: wrong, tryNumber: 1 });
    expect(res.body.correct).toBe(false);
    expect(['high', 'low']).toContain(res.body.warmCold);
  });

  it('enforces the once-a-day rule', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    const res = await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/leaderboard', () => {
  it('returns a per-guild ranking with points, streak, and solved-today', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    // u1 solves in 1 try; u2 fails
    await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    await request(app).post('/api/guess').send({ guild: 'g1', user: 'u2', guess: p.answer + 100, tryNumber: 3 });
    const res = await request(app).get('/api/leaderboard?guild=g1');
    expect(res.status).toBe(200);
    const u1 = res.body.find((r: any) => r.user === 'u1');
    const u2 = res.body.find((r: any) => r.user === 'u2');
    expect(u1.points).toBeGreaterThan(0);
    expect(u1.solvedToday).toBe(true);
    expect(u1.streak).toBe(1);
    expect(u2.points).toBe(0);
    expect(u2.solvedToday).toBe(false);
  });

  it('is scoped per guild', async () => {
    const { app } = makeApp();
    const p = generatePuzzle(NOW);
    await request(app).post('/api/guess').send({ guild: 'g1', user: 'u1', guess: p.answer, tryNumber: 1 });
    const res = await request(app).get('/api/leaderboard?guild=g2');
    expect(res.body).toEqual([]);
  });
});
