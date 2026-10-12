export class PersonaCalibration {
  public static calculateDrift(baseSkepticism: number, round: number, domainIntensity: number): number {
    return Math.min(100, Math.max(10, baseSkepticism + (round * 2.5) + (domainIntensity * 1.5)));
  }
}
