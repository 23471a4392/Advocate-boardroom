import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('End-to-End Boardroom Lifecycle Simulation', () => {
  it('should run a complete multi-turn boardroom stress-test cycle', async () => {
    // 1. Convene session
    const sessionRes = await request(app)
      .post('/api/board/session')
      .send({
        proposalTitle: 'Enterprise Kubernetes Multi-Cluster Mesh with eBPF Observability',
        proposalContent: 'An automated multi-cloud Kubernetes control plane running across AWS, GCP, and Azure with Cilium eBPF network telemetry, real-time cost throttling, and automated zero-trust mutual TLS.',
      });

    expect(sessionRes.status).toBe(201);
    const sessionId = sessionRes.body.sessionId;
    expect(sessionId).toBeDefined();

    // 2. Submit concrete defense
    const defenseRes1 = await request(app)
      .post(`/api/board/session/${sessionId}/defend`)
      .send({
        userArgument: 'We enforce automated canary deployments with Prometheus SLO gates. Our p99 latency benchmark in staging is 4.2ms with circuit breakers and fallback Redis caching. The unit economics project an 82% gross margin, with SOC 2 Type II audit pipelines active.',
        targetPersonaId: 'victor_vance',
      });

    expect(defenseRes1.status).toBe(200);
    expect(defenseRes1.body.skepticismDelta).toBeLessThanOrEqual(-10);
    expect(defenseRes1.body.argumentQuality).toBe('concrete');

    // 3. Submit hand-wavy defense
    const defenseRes2 = await request(app)
      .post(`/api/board/session/${sessionId}/defend`)
      .send({
        userArgument: 'Do not worry about the cloud bill or security, we will easily handle that later in Phase 2 once we have more funding.',
        targetPersonaId: 'elena_rostova',
      });

    expect(defenseRes2.status).toBe(200);
    expect(defenseRes2.body.skepticismDelta).toBeGreaterThanOrEqual(10);
    expect(defenseRes2.body.updatedScores['elena_rostova']).toBeGreaterThan(75);

    // 4. Request Pre-Mortem
    const preMortemRes = await request(app)
      .post(`/api/board/session/${sessionId}/pre-mortem`)
      .send({});

    expect(preMortemRes.status).toBe(200);
    expect(preMortemRes.body.survivalScore).toBeGreaterThanOrEqual(0);
    expect(preMortemRes.body.fatalFlaws.length).toBeGreaterThanOrEqual(3);
    expect(preMortemRes.body.riskMatrix.technicalRisk).toBeDefined();
    expect(preMortemRes.body.riskMatrix.financialRisk).toBeDefined();

    // 5. Query session details and message transcript
    const auditRes = await request(app).get(`/api/board/session/${sessionId}`);
    expect(auditRes.status).toBe(200);
    expect(auditRes.body.session.status).toBe('concluded');
    expect(auditRes.body.messages.length).toBeGreaterThanOrEqual(2);
    expect(auditRes.body.preMortem).toBeDefined();
  });
});
