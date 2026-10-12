import { describe, it, expect } from 'vitest';
import { DbTelemetry } from '../src/services/dbTelemetry';

describe('Database Telemetry Service', () => {
  it('should report sqlite pragma operational metrics', () => {
    const stats = DbTelemetry.getPragmaStats();
    expect(stats.journalMode).toBe('wal');
    expect(stats.pageSize).toBe(4096);
  });
});
