import { describe, it, expect } from 'vitest';
import { StreamMetrics } from '../src/services/debate/streamMetrics';

describe('Stream Metrics Telemetry', () => {
  it('should compute tokens per second accurately', () => {
    const tps = StreamMetrics.calculateThroughput(50, 1000);
    expect(tps).toBe(50);
  });
});
