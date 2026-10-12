import { describe, it, expect } from 'vitest';
import { DefenseHistoryTracker } from '../src/services/debate/defenseHistory';

describe('Defense History Tracker', () => {
  it('should compute founder defense win rate percentage', () => {
    const turns = [
      { round: 1, personaId: 'sre', delta: -15, isEffective: true },
      { round: 2, personaId: 'cfo', delta: 10, isEffective: false },
    ];
    expect(DefenseHistoryTracker.calculateWinRate(turns)).toBe(50.0);
  });
});
