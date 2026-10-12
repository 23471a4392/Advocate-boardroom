import { describe, it, expect } from 'vitest';
import { CounterProposalService } from '../src/services/debate/counterProposalService';

describe('Counter-Proposal Service', () => {
  it('should generate domain-specific counter-amendments', () => {
    const sre = CounterProposalService.generateAmendment('victor_vance');
    expect(sre).toContain('canary');
    const cfo = CounterProposalService.generateAmendment('elena_rostova');
    expect(cfo).toContain('spend');
  });
});
