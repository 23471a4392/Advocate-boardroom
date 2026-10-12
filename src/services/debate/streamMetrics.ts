export class StreamMetrics {
  public static calculateThroughput(tokenCount: number, durationMs: number): number {
    if (durationMs <= 0) return 0;
    return Number(((tokenCount / durationMs) * 1000).toFixed(2));
  }
}
