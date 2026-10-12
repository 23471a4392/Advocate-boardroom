import { describe, it, expect } from 'vitest';
import { DefenseHintsEngine } from '../src/services/debate/defenseHints';

describe('Defense Hints Engine', () => {
  it('should return 3 tactical suggestions for skeptical personas', () => {
    const hints = DefenseHintsEngine.getHints('victor_vance');
    expect(hints).toHaveLength(3);
    expect(hints[0]).toContain('chaos engineering');
  });
});
