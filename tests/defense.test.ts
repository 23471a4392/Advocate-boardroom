import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Prompt 1.3: Defense Evaluation & Executive Pre-Mortem', () => {
  let sessionId: string;

  it('should initialize a test session for defense evaluation', async () => {
    const res = await request(app)
      .post('/api/board/session')
      .send({
        proposalTitle: 'AI-Native Real-Time Fraud Prevention Engine',
        proposalContent: 'Stream-processing fraud detection engine applying edge ML models to banking transactions with sub-10ms latency.',
      });

    expect(res.status).toBe(201);
    sessionId = res.body.sessionId;
  });

  it('should reward concrete evidence with reduced skepticism score (-10 to -25)', async () => {
    const concreteDefense = {
      userArgument: 'We tested our fallback architecture with chaos engineering benchmarks: our p99 latency is bounded under 8ms using Redis caching, with circuit breakers that degrade to a rule engine if GPU inference times out. Unit economics show a 78% gross margin, and SOC 2 Type II audit logging is strictly enforced.',
      targetPersonaId: 'victor_vance',
    };

    const res = await request(app)
      .post(`/api/board/session/${sessionId}/defend`)
      .send(concreteDefense);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.rebuttal).toBeDefined();
    expect(res.body.updatedScores).toBeDefined();

    // Verify skepticismDelta is negative between -10 and -25
    expect(res.body.skepticismDelta).toBeLessThanOrEqual(-10);
    expect(res.body.skepticismDelta).toBeGreaterThanOrEqual(-25);

    // Verify updated score for Victor Vance decreased from 75
    expect(res.body.updatedScores['victor_vance']).toBeLessThan(75);
  });

  it('should penalize hand-wavy or defensive assertions with increased skepticism (+10 to +20)', async () => {
    const handWavyDefense = {
      userArgument: 'Trust us, our platform is revolutionary and users will love it. We will worry about security and profit margins later in Phase 2, it is obviously not an issue right now.',
      targetPersonaId: 'elena_rostova',
    };

    const res = await request(app)
      .post(`/api/board/session/${sessionId}/defend`)
      .send(handWavyDefense);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.rebuttal).toBeDefined();

    // Verify skepticismDelta is positive between +10 and +20
    expect(res.body.skepticismDelta).toBeGreaterThanOrEqual(10);
    expect(res.body.skepticismDelta).toBeLessThanOrEqual(20);

    // Verify updated score for Elena increased from 75
    expect(res.body.updatedScores['elena_rostova']).toBeGreaterThan(75);
  });

  it('should synthesize session into structured Executive Pre-Mortem report', async () => {
    const res = await request(app)
      .post(`/api/board/session/${sessionId}/pre-mortem`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify exact required fields:
    // survivalScore, fatalFlaws, riskMatrix, recommendedPivots, executiveSummary
    expect(typeof res.body.survivalScore).toBe('number');
    expect(res.body.survivalScore).toBeGreaterThanOrEqual(0);
    expect(res.body.survivalScore).toBeLessThanOrEqual(100);

    expect(Array.isArray(res.body.fatalFlaws)).toBe(true);
    expect(res.body.fatalFlaws.length).toBeGreaterThanOrEqual(3);

    expect(res.body.riskMatrix).toBeDefined();
    expect(res.body.riskMatrix).toHaveProperty('technicalRisk');
    expect(res.body.riskMatrix).toHaveProperty('financialRisk');
    expect(res.body.riskMatrix).toHaveProperty('securityRisk');
    expect(res.body.riskMatrix).toHaveProperty('marketRisk');

    expect(Array.isArray(res.body.recommendedPivots)).toBe(true);
    expect(res.body.recommendedPivots.length).toBeGreaterThanOrEqual(3);

    expect(typeof res.body.executiveSummary).toBe('string');
    expect(res.body.executiveSummary.length).toBeGreaterThan(20);

    // Verify session concluded state in database
    const sessionRes = await request(app).get(`/api/board/session/${sessionId}`);
    expect(sessionRes.body.session.status).toBe('concluded');
    expect(sessionRes.body.preMortem).toBeDefined();
    expect(sessionRes.body.preMortem.survivalScore).toBe(res.body.survivalScore);
  });
});
