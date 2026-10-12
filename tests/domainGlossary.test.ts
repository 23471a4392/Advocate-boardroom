import { describe, it, expect } from 'vitest';
import { DOMAIN_GLOSSARY } from '../src/services/personas/domainGlossary';

describe('Domain Glossary', () => {
  it('should contain domain terms across all 4 sectors', () => {
    expect(DOMAIN_GLOSSARY.sre).toContain('circuit breaker');
    expect(DOMAIN_GLOSSARY.cfo).toContain('unit economics');
    expect(DOMAIN_GLOSSARY.cso).toContain('zero trust');
    expect(DOMAIN_GLOSSARY.ux).toContain('churn velocity');
  });
});
