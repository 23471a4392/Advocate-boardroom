import { describe, it, expect } from 'vitest';
import { MockProvider } from '../../src/services/ai/mockProvider';

describe('Unit: Defense Evaluator Boundaries', () => {
  it('should bound new skepticism score to minimum 5 and maximum 100', () => {
    const persona: any = { id: 'victor_vance', name: 'Victor Vance', skepticismScore: 10 };
    const res = MockProvider.evaluateDefense(persona, 'We have circuit breakers, p99 benchmarks, redis fallback caching, and SOC 2 audits.', 'Pitch', 10);
    expect(res.updatedScores['victor_vance']).toBeGreaterThanOrEqual(5);
  });
});
