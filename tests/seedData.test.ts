import { describe, it, expect } from 'vitest';
import { BoardroomSeeder } from '../src/cli/seedData';

describe('Boardroom Data Seeder', () => {
  it('should generate structured sample boardroom session records', () => {
    const s = BoardroomSeeder.generateSampleSession(5);
    expect(s.sessionId).toBe('sample-session-5');
    expect(s.status).toBe('concluded');
  });
});
