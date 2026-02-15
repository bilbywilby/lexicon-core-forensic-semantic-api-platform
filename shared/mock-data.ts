import type { Memory, Checkpoint } from './types';
export const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mem-001',
    content: 'Forensic evidence indicates a lateral movement from workstation alpha to domain controller.',
    vector: [0.1, 0.9, 0.2, 0.4, 0.5, 0.1, 0.8, 0.3, 0.2, 0.1],
    metadata: { source: 'syslog-prod-01', category: 'intrusion', integrityHash: 'sha256-a1b2c3d4' },
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'mem-002',
    content: 'Anomalous encrypted outbound traffic detected on port 443 to unknown IP block in region-7.',
    vector: [0.2, 0.3, 0.8, 0.1, 0.4, 0.9, 0.2, 0.5, 0.1, 0.6],
    metadata: { source: 'netflow-01', category: 'exfiltration', integrityHash: 'sha256-e5f6g7h8' },
    timestamp: Date.now() - 7200000,
  },
  {
    id: 'mem-003',
    content: 'Credential harvesting attempt blocked on login gateway. Source user-agent: "Gozilla/5.0".',
    vector: [0.8, 0.1, 0.2, 0.9, 0.1, 0.2, 0.4, 0.1, 0.7, 0.3],
    metadata: { source: 'auth-gateway', category: 'auth-failure', integrityHash: 'sha256-i9j0k1l2' },
    timestamp: Date.now() - 10800000,
  }
];
export const MOCK_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-001',
    hash: '0x7f83b2a1c9e4d5f06123456789abcdef',
    version: 1,
    trigger: 'scheduled',
    status: 'verified',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'cp-002',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    version: 2,
    trigger: 'manual',
    status: 'verified',
    timestamp: Date.now() - 43200000,
  }
];