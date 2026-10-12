import { describe, it, expect } from 'vitest';
import { payloadSanitizer } from '../src/middleware/sanitizer';

describe('Payload Sanitizer Middleware', () => {
  it('should strip null control characters and trim whitespace', () => {
    const req: any = { body: { title: '  Proposal \u0000 Title  ' } };
    const res: any = {};
    const next = () => {};
    payloadSanitizer(req, res, next);
    expect(req.body.title).toBe('Proposal  Title');
  });
});
