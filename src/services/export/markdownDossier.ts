import { PreMortemReport } from '../../models/board.types';

export class MarkdownDossierGenerator {
  public static toMarkdown(report: PreMortemReport): string {
    return `# Executive Pre-Mortem Report: ${report.proposalTitle}\n\n**Survival Probability**: ${report.survivalScore}%\n\n## Top 3 Fatal Flaws\n${report.fatalFlaws.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n## Executive Summary\n${report.executiveSummary}\n`;
  }
}
