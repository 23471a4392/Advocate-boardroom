import { describe, it, expect } from 'vitest';
import { SystemDiagnostics } from '../src/services/health/systemDiagnostics';

describe('System Diagnostics Service', () => {
  it('should collect runtime environment diagnostics', () => {
    const report = SystemDiagnostics.getReport();
    expect(report.nodeVersion).toBeDefined();
    expect(report.platform).toBeDefined();
    expect(report.memory).toHaveProperty('rss');
  });
});
