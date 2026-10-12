import { describe, it, expect } from 'vitest';
import { DbCleanupService } from '../src/services/dbCleanup';

describe('Database Cleanup Service', () => {
  it('should execute cleanup without throwing error', () => {
    const res = DbCleanupService.cleanStaleSessions(30);
    expect(res).toHaveProperty('purgedCount');
  });
});
