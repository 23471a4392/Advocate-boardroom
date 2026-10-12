import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Prompt 1.1: Multi-Persona Boardroom Engine & Session Setup', () => {
  it('should list all 4 cynically tuned boardroom personas with initial skepticism 75', async () => {
    const res = await request(app).get('/api/board/personas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.personas).toHaveLength(4);

    const personaIds = res.body.personas.map((p: any) => p.id);
    expect(personaIds).toContain('victor_vance');
    expect(personaIds).toContain('elena_rostova');
    expect(personaIds).toContain('marcus_chen');
    expect(personaIds).toContain('sasha_morales');

    // Verify initial skepticismScore is 75
    res.body.personas.forEach((p: any) => {
      expect(p.skepticismScore).toBe(75);
      expect(p.systemPrompt).toBeDefined();
      expect(p.focusArea).toBeDefined();
    });
  });

  it('should create a new session and persist initial state via POST /api/board/session', async () => {
    const payload = {
      proposalTitle: 'Autonomous Multi-Agent DevOps Pipeline',
      proposalContent: 'An AI-orchestrated continuous deployment system where autonomous LLM agents review PRs, run automated chaos experiments, and auto-merge to Kubernetes clusters.',
      selectedPersonas: ['victor_vance', 'elena_rostova', 'marcus_chen', 'sasha_morales'],
    };

    const res = await request(app)
      .post('/api/board/session')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionId).toBeDefined();
    expect(res.body.proposalTitle).toBe(payload.proposalTitle);
    expect(res.body.personas).toHaveLength(4);

    // Initial skepticismScore must be 75 for each persona
    res.body.personas.forEach((p: any) => {
      expect(p.skepticismScore).toBe(75);
    });

    const sessionId = res.body.sessionId;

    // Verify session retrieval via GET /api/board/session/:sessionId
    const getRes = await request(app).get(`/api/board/session/${sessionId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.session.sessionId).toBe(sessionId);
    expect(getRes.body.session.proposalTitle).toBe(payload.proposalTitle);
  });

  it('should reject invalid session payloads with 400 Bad Request', async () => {
    const invalidPayload = {
      proposalTitle: 'Hi', // Too short
      proposalContent: 'Short', // Too short
    };

    const res = await request(app)
      .post('/api/board/session')
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 404 for non-existent session IDs', async () => {
    const res = await request(app).get('/api/board/session/non-existent-session-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
