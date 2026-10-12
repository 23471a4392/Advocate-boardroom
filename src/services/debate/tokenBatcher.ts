export class TokenBatcher {
  public static batchTokens(tokens: string[], maxBatchSize = 3): string[] {
    const batches: string[] = [];
    for (let i = 0; i < tokens.length; i += maxBatchSize) {
      batches.push(tokens.slice(i, i + maxBatchSize).join(''));
    }
    return batches;
  }
}
