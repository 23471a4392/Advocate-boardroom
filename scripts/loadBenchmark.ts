export class LoadBenchmarkRunner {
  public static async simulateConcurrent(requests = 5, fn = async () => true) {
    const start = Date.now();
    await Promise.all(Array.from({ length: requests }, fn));
    return Date.now() - start;
  }
}
