import { describe, it, expect } from 'vitest';
import { dbService } from '../../src/services/db';

describe('Unit: Database Service Relational Queries', () => {
  it('should return null for non-existent session', () => {
    const session = dbService.getSession('non-existent-session-id-unit');
    expect(session).toBeNull();
  });
});
