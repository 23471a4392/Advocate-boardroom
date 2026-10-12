export class ArgumentAnalyzer {
  public static analyzeDensity(text: string, keywords: string[]): { density: number; matches: string[] } {
    const lower = text.toLowerCase();
    const matches = keywords.filter((k) => lower.includes(k.toLowerCase()));
    const density = keywords.length > 0 ? matches.length / keywords.length : 0;
    return { density, matches };
  }
}
