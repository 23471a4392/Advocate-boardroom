export interface DefenseTurnRecord {
  round: number;
  personaId: string;
  delta: number;
  isEffective: boolean;
}

export class DefenseHistoryTracker {
  public static calculateWinRate(turns: DefenseTurnRecord[]): number {
    if (turns.length === 0) return 0;
    const wins = turns.filter((t) => t.isEffective).length;
    return Number(((wins / turns.length) * 100).toFixed(1));
  }
}
