import { describe, it, expect } from 'vitest';
import { ArgumentAnalyzer } from '../src/services/nlp/argumentAnalyzer';

describe('Argument Analyzer NLP', () => {
  it('should compute keyword density and return matched terms', () => {
    const res = ArgumentAnalyzer.analyzeDensity('We enforce circuit breakers and p99 latency SLOs', ['circuit breaker', 'p99', 'cac']);
    expect(res.matches).toContain('circuit breaker');
    expect(res.matches).toContain('p99');
    expect(res.density).toBeCloseTo(0.666, 2);
  });
});
