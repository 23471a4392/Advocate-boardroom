import { describe, it, expect } from 'vitest';
import { MarkdownDossierGenerator } from '../src/services/export/markdownDossier';

describe('Markdown Dossier Generator', () => {
  it('should generate formatted GitHub Markdown text', () => {
    const report: any = {
      proposalTitle: 'AI Mesh',
      survivalScore: 60,
      fatalFlaws: ['Flaw 1', 'Flaw 2', 'Flaw 3'],
      executiveSummary: 'Summary',
    };
    const md = MarkdownDossierGenerator.toMarkdown(report);
    expect(md).toContain('# Executive Pre-Mortem Report: AI Mesh');
    expect(md).toContain('**Survival Probability**: 60%');
  });
});
