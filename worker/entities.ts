import { IndexedEntity } from "./core-utils";
import type { Memory, Checkpoint, LogEvent } from "@shared/types";
import { MOCK_MEMORIES, MOCK_CHECKPOINTS } from "@shared/mock-data";
export class MemoryEntity extends IndexedEntity<Memory> {
  static readonly entityName = "memory";
  static readonly indexName = "memories";
  static readonly initialState: Memory = {
    id: "",
    content: "",
    vector: [],
    metadata: { source: "", category: "", integrityHash: "" },
    timestamp: 0
  };
  static seedData = MOCK_MEMORIES;
}
export class CheckpointEntity extends IndexedEntity<Checkpoint> {
  static readonly entityName = "checkpoint";
  static readonly indexName = "checkpoints";
  static readonly initialState: Checkpoint = {
    id: "",
    hash: "",
    version: 0,
    trigger: "event",
    status: "pending",
    timestamp: 0
  };
  static seedData = MOCK_CHECKPOINTS.map((cp, i) => ({ ...cp, version: i + 1 }));
}
export class LogEntity extends IndexedEntity<LogEvent> {
  static readonly entityName = "log";
  static readonly indexName = "logs";
  static readonly initialState: LogEvent = {
    id: "",
    message: "",
    type: "system",
    level: "info",
    timestamp: 0
  };
  static seedData: LogEvent[] = [
    {
      id: "log-001",
      message: "Lexicon Core Engine Initialized on Edge Node Alpha",
      type: "system",
      level: "info",
      timestamp: Date.now() - 10000
    },
    {
      id: "log-002",
      message: "Memory bank synchronization complete",
      type: "ingest",
      level: "info",
      timestamp: Date.now() - 5000
    }
  ];
}