import { IndexedEntity } from "./core-utils";
import type { Memory, Checkpoint } from "@shared/types";
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
    trigger: "event", 
    status: "pending", 
    timestamp: 0 
  };
  static seedData = MOCK_CHECKPOINTS;
}