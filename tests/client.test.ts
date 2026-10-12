import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Executive Boardroom Web Dashboard', () => {
  it('should serve index.html on GET / with executive boardroom title', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('CONTRABOARD');
    expect(res.text).toContain("Devil's Advocate Boardroom");
    expect(res.text).toContain('Convene Devil\'s Advocate Board');
  });

  it('should serve public style.css and app.js assets', async () => {
    const cssRes = await request(app).get('/style.css');
    expect(cssRes.status).toBe(200);
    expect(cssRes.headers['content-type']).toContain('text/css');

    const jsRes = await request(app).get('/app.js');
    expect(jsRes.status).toBe(200);
    expect(jsRes.headers['content-type']).toContain('javascript');
  });
});
