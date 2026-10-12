import { describe, it, expect } from 'vitest';
import { TurnScheduler } from '../src/services/debate/turnScheduler';

describe('Turn Scheduler', () => {
  it('should generate valid crossfire clash sequence pairs', () => {
    const pairs = TurnScheduler.scheduleCrossfirePairs();
    expect(pairs.length).toBe(4);
    expect(pairs[0].speaker).toBe('elena_rostova');
  });
});
