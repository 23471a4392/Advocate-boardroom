import { describe, it, expect } from 'vitest';
import { LruCache } from '../src/services/cache/lruCache';

describe('LRU Cache Service', () => {
  it('should evict least recently used entries when capacity is exceeded', () => {
    const cache = new LruCache<number>(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a'); // Mark 'a' as recently used
    cache.set('c', 3); // Should evict 'b'
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBe(3);
  });
});
