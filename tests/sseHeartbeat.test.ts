import { describe, it, expect } from 'vitest';
import { SseHeartbeat } from '../src/services/debate/sseHeartbeat';

describe('SSE Heartbeat Formatter', () => {
  it('should format valid SSE comment packet with prefix', () => {
    const packet = SseHeartbeat.formatHeartbeat(123456789);
    expect(packet).toBe(': heartbeat 123456789\n\n');
  });
});
