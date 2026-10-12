export class SseReplayHelper {
  public static filterMissedEvents(events: Array<{ id: string }>, lastEventId?: string): Array<{ id: string }> {
    if (!lastEventId) return events;
    const idx = events.findIndex((e) => e.id === lastEventId);
    if (idx === -1) return events;
    return events.slice(idx + 1);
  }
}
