import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Frontend Direct API Integration Compatibility', () => {
  it('should initialize session with frontend proposal and persona format', async () => {
    const res = await request(app)
      .post('/api/board/session')
      .send({
        proposal: {
          id: 'preset-1',
          title: 'Migrate Core Monolith to Kafka-Driven Microservices',
          summary: 'Deconstruct our Django monolith into 28 microservices orchestrated with Kubernetes and Kafka.',
          category: 'Infrastructure & Tech',
          keyAssumptions: ['Velocity increases 300%', 'Event streams eliminate database coupling'],
        },
        personas: [
          { id: 'sre', name: 'Victor Vance' },
          { id: 'cfo', name: 'Elena Rostova' },
          { id: 'cso', name: 'Marcus Chen' },
          { id: 'ux', name: 'Sasha Morales' },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.personas).toHaveLength(4);
  });

  it('should fetch Round 1 opening critiques via GET /api/board/round/1', async () => {
    const res = await request(app).get('/api/board/round/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body[0]).toHaveProperty('speakerId');
    expect(res.body[0]).toHaveProperty('content');
    expect(res.body[0].round).toBe(1);
  });

  it('should fetch Round 2 crossfire critiques via GET /api/board/round/2', async () => {
    const res = await request(app).get('/api/board/round/2');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body[0]).toHaveProperty('targetId');
    expect(res.body[0].round).toBe(2);
  });

  it('should evaluate defense via POST /api/board/defend with frontend schema', async () => {
    const res = await request(app)
      .post('/api/board/defend')
      .send({
        defenseText: 'We tested our distributed partition recovery with chaos mesh experiments; our p99 latency remains under 6ms with Redis cache fallbacks and SOC 2 audits.',
        targetPersonaId: 'sre',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('rebuttalMessage');
    expect(res.body.rebuttalMessage.speakerId).toBe('sre');
    expect(res.body.wasEffective).toBe(true);
    expect(res.body.skepticismDelta).toBeLessThanOrEqual(-10);
  });

  it('should return Pre-Mortem via GET /api/board/pre-mortem with frontend schema', async () => {
    const res = await request(app).get('/api/board/pre-mortem');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('survivalScore');
    expect(res.body).toHaveProperty('fatalFlaws');
    expect(res.body).toHaveProperty('riskMatrix');
    expect(res.body.riskMatrix).toHaveProperty('technical');
    expect(res.body.riskMatrix).toHaveProperty('financial');
    expect(res.body).toHaveProperty('executiveVerdict');
  });
});
