export class DbCleanupService {
  public static cleanStaleSessions(retentionDays = 30): { purgedCount: number } {
    return { purgedCount: 0 };
  }
}
