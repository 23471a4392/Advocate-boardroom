export class DbBenchmark {
  public static measureLatency(fn: () => void): number {
    const start = performance.now();
    fn();
    return performance.now() - start;
  }
}
