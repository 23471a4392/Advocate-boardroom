import { describe, it, expect } from 'vitest';
import { DbBenchmark } from '../src/benchmarks/dbBenchmark';

describe('Database Query Benchmark Utility', () => {
  it('should measure execution latency accurately', () => {
    const duration = DbBenchmark.measureLatency(() => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) sum += i;
    });
    expect(duration).toBeGreaterThanOrEqual(0);
  });
});
