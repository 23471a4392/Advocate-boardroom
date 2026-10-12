import { describe, it, expect } from 'vitest';
import { EtagHelper } from '../src/services/cache/etagHelper';

describe('ETag Helper Utility', () => {
  it('should generate weak ETag hash string', () => {
    const etag = EtagHelper.generateEtag({ version: 1 });
    expect(etag.startsWith('W/"')).toBe(true);
    expect(etag.endsWith('"')).toBe(true);
  });
});
