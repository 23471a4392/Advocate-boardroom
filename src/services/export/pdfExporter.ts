import { PreMortemReport } from '../../models/board.types';

export class PreMortemExporter {
  public static generatePrintableHtml(report: PreMortemReport): string {
    return `<!DOCTYPE html><html><head><title>Pre-Mortem: ${report.proposalTitle}</title></head><body><h1>EXECUTIVE PRE-MORTEM</h1><h2>Survival Score: ${report.survivalScore}%</h2><p>${report.executiveSummary}</p></body></html>`;
  }
}
