import { describe, it, expect } from 'vitest';
import { PersonaCalibration } from '../src/services/personas/personaCalibration';

describe('Persona Calibration Metrics', () => {
  it('should compute calibrated skepticism drift bounded between 10 and 100', () => {
    const val = PersonaCalibration.calculateDrift(75, 2, 3);
    expect(val).toBeGreaterThanOrEqual(10);
    expect(val).toBeLessThanOrEqual(100);
  });
});
