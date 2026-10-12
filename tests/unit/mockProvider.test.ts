import { describe, it, expect } from 'vitest';
import { MockProvider } from '../../src/services/ai/mockProvider';

describe('Unit: MockProvider Keyword Extraction', () => {
  it('should tailor Victor Vance salvo when proposal contains microservice keyword', () => {
    const persona: any = { id: 'victor_vance' };
    const salvo = MockProvider.generateOpeningSalvo(persona, 'Microservice Architecture', 'Converting to distributed microservices');
    expect(salvo).toContain('distributed');
  });

  it('should tailor Elena CFO salvo when proposal mentions pricing', () => {
    const persona: any = { id: 'elena_rostova' };
    const salvo = MockProvider.generateOpeningSalvo(persona, 'Freemium Model', 'Offering free accounts to developers');
    expect(salvo).toContain('CAC');
  });
});
