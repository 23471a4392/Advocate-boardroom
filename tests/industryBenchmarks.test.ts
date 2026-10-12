import { describe, it, expect } from 'vitest';
import { IndustryBenchmarkService } from '../src/services/analytics/industryBenchmarks';

describe('Industry Benchmark Service', () => {
  it('should return standard industry benchmarks', () => {
    const bm = IndustryBenchmarkService.getBenchmark('fintech');
    expect(bm.security).toBe(85);
  });
});
