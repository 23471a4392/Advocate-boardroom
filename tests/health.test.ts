import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('System Health & Configuration', () => {
  it('should return 200 and healthy status on GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('service');
    expect(res.body).toHaveProperty('uptimeSeconds');
  });
});
