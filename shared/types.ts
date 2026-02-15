export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
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
  trigger: 'manual' | 'scheduled' | 'event';
  status: 'verified' | 'pending' | 'failed';
  timestamp: number;
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
}
export interface SystemMetrics {
  latency: number[];
  requestCount: number;
  cacheHitRate: number;
  uptime: number;
  memoryCount: number;
  lastCheckpoint: Checkpoint | null;
}