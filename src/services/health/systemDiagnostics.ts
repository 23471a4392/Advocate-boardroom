export class SystemDiagnostics {
  public static getReport() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
    };
  }
}
