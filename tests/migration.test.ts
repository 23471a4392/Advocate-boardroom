import { describe, it, expect } from 'vitest';
import { MigrationRunner } from '../src/services/migrations/migrationRunner';

describe('Database Migration Runner', () => {
  it('should report registered schema migrations', () => {
    expect(MigrationRunner.getMigrationsCount()).toBeGreaterThanOrEqual(1);
  });
});
