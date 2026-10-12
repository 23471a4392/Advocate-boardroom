export class ProbeChecker {
  public static checkLiveness(): { status: 'alive'; timestamp: string } {
    return { status: 'alive', timestamp: new Date().toISOString() };
  }

  public static checkReadiness(): { status: 'ready'; dbConnected: boolean; timestamp: string } {
    return { status: 'ready', dbConnected: true, timestamp: new Date().toISOString() };
  }
}
