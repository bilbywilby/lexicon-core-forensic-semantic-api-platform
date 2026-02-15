import { Hono } from "hono";
import type { Env } from './core-utils';
import { MemoryEntity, CheckpointEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { RetrievalRequest, RetrievalResponse, RetrievalResult } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MEMORIES
  app.get('/api/memories', async (c) => {
    await MemoryEntity.ensureSeed(c.env);
    const page = await MemoryEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/memories', async (c) => {
    const data = await c.req.json();
    const memory = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      vector: Array.from({ length: 10 }, () => Math.random())
    };
    return ok(c, await MemoryEntity.create(c.env, memory));
  });
  app.delete('/api/memories/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await MemoryEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // CHECKPOINTS
  app.get('/api/checkpoints', async (c) => {
    await CheckpointEntity.ensureSeed(c.env);
    const page = await CheckpointEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/checkpoints', async (c) => {
    const cp = {
      id: crypto.randomUUID(),
      hash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      trigger: 'manual',
      status: 'verified',
      timestamp: Date.now()
    };
    return ok(c, await CheckpointEntity.create(c.env, cp as any));
  });
  // RETRIEVAL (Mock Semantic Search)
  app.post('/api/retrieve', async (c) => {
    const start = Date.now();
    const req = await c.req.json() as RetrievalRequest;
    const { items } = await MemoryEntity.list(c.env);
    // Mock cosine similarity ranking
    const matches: RetrievalResult[] = items.map(m => ({
      ...m,
      score: Math.random() // Simulating similarity
    }))
    .filter(m => m.score >= req.threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, req.topK);
    const response: RetrievalResponse = {
      matches,
      latencyMs: Date.now() - start
    };
    return ok(c, response);
  });
  // METRICS
  app.get('/api/metrics', async (c) => {
    const mems = await MemoryEntity.list(c.env);
    const cps = await CheckpointEntity.list(c.env);
    return ok(c, {
      latency: [45, 52, 48, 61, 55, 49, 42],
      requestCount: 1240,
      cacheHitRate: 0.94,
      uptime: 99.99,
      memoryCount: mems.items.length,
      lastCheckpoint: cps.items[cps.items.length - 1] || null
    });
  });
}