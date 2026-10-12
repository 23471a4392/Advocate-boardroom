export class SseHeartbeat {
  public static formatHeartbeat(timestamp = Date.now()): string {
    return `: heartbeat ${timestamp}\n\n`;
  }
}
