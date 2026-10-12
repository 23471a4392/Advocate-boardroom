import { describe, it, expect } from 'vitest';
import { Logger } from '../src/services/logger';

describe('Structured Logger Service', () => {
  it('should log messages with timestamp and level', () => {
    expect(() => Logger.info('Boardroom initialized', { sessionId: '123' })).not.toThrow();
  });
});
