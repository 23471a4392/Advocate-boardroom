import { describe, it, expect } from 'vitest';
import { TokenBatcher } from '../src/services/debate/tokenBatcher';

describe('Token Micro-Batcher', () => {
  it('should group tokens into micro batches to reduce socket writes', () => {
    const tokens = ['Hello ', 'world ', 'from ', 'ContraBoard '];
    const batched = TokenBatcher.batchTokens(tokens, 2);
    expect(batched).toHaveLength(2);
    expect(batched[0]).toBe('Hello world ');
  });
});
