import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Compression Helper Middleware', () => {
  it('should set Vary Accept-Encoding header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['vary']).toContain('Accept-Encoding');
  });
});
