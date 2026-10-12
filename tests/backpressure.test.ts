import { describe, it, expect } from 'vitest';
import { BackpressureController } from '../src/services/debate/backpressureController';

describe('Stream Backpressure Controller', () => {
  it('should enqueue and dequeue tokens respecting maximum queue size', () => {
    const ctrl = new BackpressureController(2);
    expect(ctrl.enqueue('token1')).toBe(true);
    expect(ctrl.enqueue('token2')).toBe(true);
    expect(ctrl.enqueue('token3')).toBe(false);
    expect(ctrl.dequeue()).toBe('token1');
  });
});
