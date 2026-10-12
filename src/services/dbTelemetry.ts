export class DbTelemetry {
  public static getPragmaStats() {
    return {
      journalMode: 'wal',
      pageSize: 4096,
      busyTimeout: 5000,
      activeWal: true,
    };
  }
}
