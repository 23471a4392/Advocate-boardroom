import { describe, it, expect } from 'vitest';
import { SseReplayHelper } from '../src/services/debate/sseReplay';

describe('SSE Event Replay Helper', () => {
  it('should slice missed events after Last-Event-ID', () => {
    const list = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const missed = SseReplayHelper.filterMissedEvents(list, '1');
    expect(missed).toHaveLength(2);
    expect(missed[0].id).toBe('2');
  });
});
