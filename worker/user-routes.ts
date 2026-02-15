import { Hono } from "hono";
import type { Env } from './core-utils';
import { MemoryEntity, CheckpointEntity, LogEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { RetrievalRequest, RetrievalResponse, RetrievalResult, IngestRequest, LogEvent } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MEMORIES & INGESTION
  app.get('/api/memories', async (c) => {
    await MemoryEntity.ensureSeed(c.env);
    const page = await MemoryEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/ingest', async (c) => {
    const data = await c.req.json() as IngestRequest;
    if (!data.content || !data.source) return bad(c, "Missing content or source");
    const memory = {
      id: crypto.randomUUID(),
      content: data.content,
      vector: Array.from({ length: 10 }, () => Math.random()),
      metadata: { 
        source: data.source, 
        category: data.category || 'general', 
        integrityHash: 'sha256-' + Math.random().toString(16).slice(2) 
      },
      timestamp: Date.now()
    };
    const result = await MemoryEntity.create(c.env, memory);
    await LogEntity.create(c.env, {
      id: crypto.randomUUID(),
      message: `Forensic memory ingested from ${data.source}`,
      type: 'ingest',
      level: 'info',
      timestamp: Date.now()
    });
    return ok(c, result);
  });
  app.delete('/api/memories/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await MemoryEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // LOGS
  app.get('/api/logs', async (c) => {
    await LogEntity.ensureSeed(c.env);
    const { items } = await LogEntity.list(c.env);
    return ok(c, items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50));
  });
  // CHECKPOINTS (With CAS Simulation)
  app.get('/api/checkpoints', async (c) => {
    await CheckpointEntity.ensureSeed(c.env);
    const page = await CheckpointEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/checkpoints', async (c) => {
    const { version } = await c.req.json();
    const { items } = await CheckpointEntity.list(c.env);
    const currentMaxVersion = Math.max(...items.map(cp => cp.version), 0);
    if (version !== undefined && version <= currentMaxVersion) {
      return c.json({ 
        success: false, 
        error: `Conflict: Version ${version} is stale. Current: ${currentMaxVersion}` 
      }, 409);
    }
    const cp = {
      id: crypto.randomUUID(),
      hash: '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      version: currentMaxVersion + 1,
      trigger: 'manual',
      status: 'verified',
      timestamp: Date.now()
    };
    const result = await CheckpointEntity.create(c.env, cp as any);
    await LogEntity.create(c.env, {
      id: crypto.randomUUID(),
      message: `Forensic checkpoint created (v${cp.version})`,
      type: 'checkpoint',
      level: 'info',
      timestamp: Date.now()
    });
    return ok(c, result);
  });
  // RETRIEVAL
  app.post('/api/retrieve', async (c) => {
    const start = Date.now();
    const req = await c.req.json() as RetrievalRequest;
    const { items } = await MemoryEntity.list(c.env);
    const matches: RetrievalResult[] = items.map(m => ({
      ...m,
      score: Math.random() 
    }))
    .filter(m => m.score >= (req.threshold || 0))
    .sort((a, b) => b.score - a.score)
    .slice(0, req.topK || 5);
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
    const logs = await LogEntity.list(c.env);
    return ok(c, {
      latency: [45, 52, 48, 61, 55, 49, 42],
      requestCount: 1240,
      cacheHitRate: 0.94,
      uptime: 99.99,
      memoryCount: mems.items.length,
      lastCheckpoint: cps.items.sort((a, b) => b.timestamp - a.timestamp)[0] || null,
      recentLogs: logs.items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
    });
  });
}