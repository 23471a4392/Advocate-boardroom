import { dbService } from './db';

export class DbExportService {
  public static exportAuditDump() {
    const sessions = dbService.listSessions(100);
    return {
      exportedAt: new Date().toISOString(),
      sessionCount: sessions.length,
      sessions,
    };
  }
}
