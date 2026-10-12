import { describe, it, expect } from 'vitest';
import { LoadBenchmarkRunner } from '../scripts/loadBenchmark';

describe('Synthetic Load Benchmark Runner', () => {
  it('should execute concurrent promises and measure elapsed duration', async () => {
    const elapsed = await LoadBenchmarkRunner.simulateConcurrent(10, async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    expect(elapsed).toBeGreaterThanOrEqual(5);
  });
});
