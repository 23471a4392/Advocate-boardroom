import { describe, it, expect } from 'vitest';
import { RiskRadarMath } from '../src/services/analytics/riskRadarMath';

describe('Risk Radar Analytics Math', () => {
  it('should calculate composite risk index correctly', () => {
    const idx = RiskRadarMath.calculateCompositeIndex({
      technicalRisk: 80,
      financialRisk: 70,
      securityRisk: 60,
      marketRisk: 50,
    });
    expect(idx).toBe(65.0);
  });
});
