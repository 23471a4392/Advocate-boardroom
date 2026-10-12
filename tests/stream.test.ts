import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Prompt 1.2: Debate Orchestration & Server-Sent Events (SSE)', () => {
  it('should stream debate rounds via SSE and emit proper event protocol', async () => {
    // 1. Create a session
    const sessionRes = await request(app)
      .post('/api/board/session')
      .send({
        proposalTitle: 'Decentralized High-Frequency Trading Platform',
        proposalContent: 'An in-memory order book running on distributed nodes with sub-millisecond settlement, using optimistic locking and cross-chain relays.',
        selectedPersonas: ['victor_vance', 'elena_rostova', 'marcus_chen', 'sasha_morales'],
      });

    expect(sessionRes.status).toBe(201);
    const sessionId = sessionRes.body.sessionId;

    // 2. Stream debate events
    const streamRes = await request(app)
      .get(`/api/board/session/${sessionId}/stream`)
      .expect(200);

    expect(streamRes.headers['content-type']).toContain('text/event-stream');

    const streamText = streamRes.text;

    // Verify Event Stream Protocol events are present
    expect(streamText).toContain('event: connected');
    expect(streamText).toContain('event: board_convened');
    expect(streamText).toContain('event: round_started');
    expect(streamText).toContain('event: persona_started');
    expect(streamText).toContain('event: persona_token');
    expect(streamText).toContain('event: persona_finished');
    expect(streamText).toContain('event: tension_update');
    expect(streamText).toContain('event: round_transition');
    expect(streamText).toContain('event: debate_concluded');

    // 3. Verify messages were saved to the database
    const sessionDetailRes = await request(app).get(`/api/board/session/${sessionId}`);
    expect(sessionDetailRes.status).toBe(200);
    expect(sessionDetailRes.body.messages.length).toBeGreaterThanOrEqual(8); // 4 salvos + 4 crossfires
    expect(sessionDetailRes.body.session.status).toBe('defending');
  }, 30000); // Allow sufficient timeout for simulated streaming

  it('should return 404 if streaming non-existent session', async () => {
    const res = await request(app).get('/api/board/session/non-existent-1234/stream');
    expect(res.status).toBe(404);
  });
});
