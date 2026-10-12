import { describe, it, expect } from 'vitest';
import { ProbeChecker } from '../src/services/health/probeChecker';

describe('Probe Checker Service', () => {
  it('should report liveness and readiness statuses', () => {
    expect(ProbeChecker.checkLiveness().status).toBe('alive');
    expect(ProbeChecker.checkReadiness().status).toBe('ready');
  });
});
