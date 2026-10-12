import { RiskMatrix } from '../../models/board.types';

export class RiskRadarMath {
  public static calculateCompositeIndex(matrix: RiskMatrix): number {
    const vals = [matrix.technicalRisk, matrix.financialRisk, matrix.securityRisk, matrix.marketRisk];
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Number(avg.toFixed(2));
  }
}
