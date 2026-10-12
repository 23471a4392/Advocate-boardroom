import { describe, it, expect } from 'vitest';
import { PreMortemExporter } from '../src/services/export/pdfExporter';

describe('Pre-Mortem Briefing Exporter', () => {
  it('should render valid printable briefing HTML string', () => {
    const report: any = { proposalTitle: 'Mesh', survivalScore: 55, executiveSummary: 'Risk' };
    const html = PreMortemExporter.generatePrintableHtml(report);
    expect(html).toContain('EXECUTIVE PRE-MORTEM');
    expect(html).toContain('Survival Score: 55%');
  });
});
