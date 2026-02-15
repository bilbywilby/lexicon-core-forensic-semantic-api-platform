export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: number;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}
export interface Memory {
  id: string;
  content: string;
  vector: number[];
  metadata: {
    source: string;
    category: string;
    integrityHash: string;
  };
  timestamp: number;
}
export interface Checkpoint {
  id: string;
  hash: string;
  version: number;
  trigger: 'manual' | 'scheduled' | 'event';
  status: 'verified' | 'pending' | 'failed';
  timestamp: number;
}
export interface LogEvent {
  id: string;
  message: string;
  type: 'ingest' | 'checkpoint' | 'retrieval' | 'system';
  level: 'info' | 'warn' | 'error';
  timestamp: number;
  metadata?: Record<string, unknown>;
}
export interface IngestRequest {
  content: string;
  source: string;
  category?: string;
}
export interface RetrievalRequest {
  query?: string;
  vector?: number[];
  topK: number;
  threshold: number;
}
export interface RetrievalResult extends Memory {
  score: number;
}
export interface RetrievalResponse {
  matches: RetrievalResult[];
  latencyMs: number;
  traceId: string;
}
export interface SystemMetrics {
  latency: number[];
  requestCount: number;
  cacheHitRate: number;
  uptime: string;
  do_sim: boolean;
  memoryCount: number;
  lastCheckpoint: Checkpoint | null;
  recentLogs: LogEvent[];
  systemMetadata: {
    nodeId: string;
    region: string;
  };
}